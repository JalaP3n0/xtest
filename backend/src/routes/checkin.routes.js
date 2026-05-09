const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRoles } = require("../middleware/auth");

const router = express.Router();
const GEOFENCE_RADIUS_KM = 0.3;

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

router.post("/", requireAuth, requireRoles("USHER", "ADMIN"), async (req, res) => {
  const { eventId, lat, lng, kind } = req.body;

  if (!eventId) {
    return res.status(400).json({ message: "eventId is required" });
  }
  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ message: "lat and lng must be numbers" });
  }

  const normalizedKind = (kind || "IN").toUpperCase();
  if (!["IN", "OUT", "PING"].includes(normalizedKind)) {
    return res.status(400).json({ message: "kind must be IN, OUT, or PING" });
  }

  try {
    let usher = null;
    if (req.user.role === "USHER") {
      usher = await prisma.usher.findUnique({
        where: { userId: req.user.userId },
      });
      if (!usher) {
        return res.status(404).json({ message: "Usher profile not found for this user" });
      }
    } else {
      const { usherId } = req.body;
      if (!usherId) {
        return res.status(400).json({ message: "usherId is required for admin check-in" });
      }
      usher = await prisma.usher.findUnique({ where: { id: usherId } });
      if (!usher) {
        return res.status(404).json({ message: "Usher not found" });
      }
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        eventId,
        usherId: usher.id,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (!booking) {
      return res.status(403).json({ message: "No active booking for this usher on the event" });
    }

    const distanceKm = haversineKm(event.lat, event.lng, lat, lng);
    const withinZone = distanceKm <= GEOFENCE_RADIUS_KM;

    const checkin = await prisma.checkin.create({
      data: {
        eventId,
        usherId: usher.id,
        lat,
        lng,
        distanceKm: Number(distanceKm.toFixed(3)),
        withinZone,
        kind: normalizedKind,
      },
      include: {
        usher: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        event: {
          select: { id: true, name: true, lat: true, lng: true },
        },
      },
    });

    await prisma.usher.update({
      where: { id: usher.id },
      data: { lat, lng },
    });

    return res.status(201).json({
      ...checkin,
      geofenceRadiusKm: GEOFENCE_RADIUS_KM,
      alert: withinZone ? null : "Outside geofence radius",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create check-in", details: error.message });
  }
});

module.exports = router;

