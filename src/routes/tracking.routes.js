const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

async function ensureEventAccess(eventId, user) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return { event: null, denied: false };
  }

  if (user.role === "CLIENT" && event.clientId !== user.userId) {
    return { event, denied: true };
  }

  return { event, denied: false };
}

router.get("/event/:eventId/latest", requireAuth, async (req, res) => {
  try {
    const { event, denied } = await ensureEventAccess(req.params.eventId, req.user);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (denied) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        eventId: event.id,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      include: {
        usher: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            checkins: {
              where: { eventId: event.id },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    const latest = bookings.map((booking) => ({
      bookingId: booking.id,
      bookingStatus: booking.status,
      usherId: booking.usher.id,
      usher: booking.usher.user,
      latestCheckin: booking.usher.checkins[0] || null,
    }));

    return res.json({
      eventId: event.id,
      eventName: event.name,
      generatedAt: new Date().toISOString(),
      latest,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch latest tracking", details: error.message });
  }
});

router.get("/event/:eventId/timeline", requireAuth, async (req, res) => {
  try {
    const { event, denied } = await ensureEventAccess(req.params.eventId, req.user);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (denied) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const checkins = await prisma.checkin.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        usher: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    return res.json({
      eventId: event.id,
      total: checkins.length,
      timeline: checkins,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tracking timeline", details: error.message });
  }
});

module.exports = router;

