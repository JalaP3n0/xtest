const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRoles } = require("../middleware/auth");

const router = express.Router();

async function ensureEventAccess(eventId, user) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) return { event: null, denied: false };
  if (user.role === "CLIENT" && event.clientId !== user.userId) return { event, denied: true };
  return { event, denied: false };
}

router.post("/", requireAuth, requireRoles("CLIENT", "ADMIN"), async (req, res) => {
  const { eventId, usherId, rating, comment } = req.body;

  if (!eventId || !usherId) {
    return res.status(400).json({ message: "eventId and usherId are required" });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "rating must be an integer between 1 and 5" });
  }

  try {
    const { event, denied } = await ensureEventAccess(eventId, req.user);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (denied) return res.status(403).json({ message: "Forbidden" });

    const booking = await prisma.booking.findFirst({
      where: {
        eventId,
        usherId,
        status: { in: ["CONFIRMED", "COMPLETED", "NO_SHOW", "ACCEPTED"] },
      },
    });

    if (!booking) {
      return res.status(400).json({ message: "No valid booking found for this usher/event pair" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const savedRating = await tx.rating.upsert({
        where: {
          eventId_usherId: {
            eventId,
            usherId,
          },
        },
        update: {
          rating,
          comment: comment || null,
          raterId: req.user.userId,
        },
        create: {
          eventId,
          usherId,
          rating,
          comment: comment || null,
          raterId: req.user.userId,
        },
      });

      const aggregate = await tx.rating.aggregate({
        where: { usherId },
        _avg: { rating: true },
      });

      const averageRating = Number((aggregate._avg.rating || 5).toFixed(2));
      await tx.usher.update({
        where: { id: usherId },
        data: { rating: averageRating },
      });

      return {
        savedRating,
        averageRating,
      };
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save rating", details: error.message });
  }
});

router.get("/event/:eventId", requireAuth, async (req, res) => {
  try {
    const { event, denied } = await ensureEventAccess(req.params.eventId, req.user);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (denied) return res.status(403).json({ message: "Forbidden" });

    const ratings = await prisma.rating.findMany({
      where: { eventId: req.params.eventId },
      orderBy: { createdAt: "desc" },
      include: {
        usher: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        rater: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    return res.json(ratings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch ratings", details: error.message });
  }
});

module.exports = router;

