const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRoles } = require("../middleware/auth");

const router = express.Router();

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(a));
}

function distanceScore(distanceKm) {
  if (distanceKm < 2) return 1;
  if (distanceKm < 5) return 0.8;
  if (distanceKm < 10) return 0.5;
  return 0.2;
}

function computeMatchScore(event, usher) {
  if (typeof usher.lat !== "number" || typeof usher.lng !== "number") {
    return { score: 0, distanceKm: null };
  }

  const distanceKm = haversineKm(event.lat, event.lng, usher.lat, usher.lng);
  const distComponent = distanceScore(distanceKm) * 0.4;
  const ratingComponent = Math.min(usher.rating / 5, 1) * 0.3;
  const reliabilityComponent = Math.min(usher.reliabilityScore / 100, 1) * 0.2;
  const langComponent = usher.languages.includes(event.language) ? 0.1 : 0;

  return {
    score: Number((distComponent + ratingComponent + reliabilityComponent + langComponent).toFixed(3)),
    distanceKm: Number(distanceKm.toFixed(2)),
  };
}

router.post("/", requireAuth, requireRoles("CLIENT", "ADMIN"), async (req, res) => {
  const { name, lat, lng, date, requiredUshers, language } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "name is required" });
  }
  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ message: "lat and lng must be numbers" });
  }
  if (!date || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ message: "date must be a valid ISO date string" });
  }
  if (!Number.isInteger(requiredUshers) || requiredUshers <= 0) {
    return res.status(400).json({ message: "requiredUshers must be a positive integer" });
  }
  if (!language || typeof language !== "string") {
    return res.status(400).json({ message: "language is required" });
  }

  try {
    const event = await prisma.event.create({
      data: {
        clientId: req.user.userId,
        name: name.trim(),
        lat,
        lng,
        date: new Date(date),
        requiredUshers,
        language: language.trim(),
      },
    });

    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create event", details: error.message });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch event", details: error.message });
  }
});

router.get("/:id/match", requireAuth, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user.role === "CLIENT" && event.clientId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ushers = await prisma.usher.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const matches = ushers
      .map((usher) => {
        const metrics = computeMatchScore(event, usher);
        return {
          usherId: usher.id,
          user: usher.user,
          bio: usher.bio,
          languages: usher.languages,
          rating: usher.rating,
          reliabilityScore: usher.reliabilityScore,
          distanceKm: metrics.distanceKm,
          matchScore: metrics.score,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, event.requiredUshers * 3);

    return res.json({
      eventId: event.id,
      requiredUshers: event.requiredUshers,
      totalCandidates: ushers.length,
      matches,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate matches", details: error.message });
  }
});

module.exports = router;
