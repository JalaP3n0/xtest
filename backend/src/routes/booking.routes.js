const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRoles } = require("../middleware/auth");

const router = express.Router();
const CLIENT_ALLOWED_STATUSES = ["PENDING", "CONFIRMED", "CANCELED", "NO_SHOW", "COMPLETED"];
const USHER_ALLOWED_STATUSES = ["ACCEPTED", "CANCELED"];

function applyReliabilityDelta(currentScore, previousStatus, nextStatus) {
  let score = currentScore;

  if (previousStatus !== "NO_SHOW" && nextStatus === "NO_SHOW") score -= 10;
  if (previousStatus === "NO_SHOW" && nextStatus !== "NO_SHOW") score += 10;
  if (previousStatus !== "COMPLETED" && nextStatus === "COMPLETED") score += 2;
  if (previousStatus === "COMPLETED" && nextStatus !== "COMPLETED") score -= 2;

  return Math.max(0, Math.min(100, Number(score.toFixed(2))));
}

router.post("/", requireAuth, requireRoles("CLIENT", "ADMIN"), async (req, res) => {
  const { eventId, usherId, status } = req.body;

  if (!eventId || !usherId) {
    return res.status(400).json({ message: "eventId and usherId are required" });
  }

  const bookingStatus = (status || "CONFIRMED").toUpperCase();
  if (!["PENDING", "CONFIRMED", "CANCELED"].includes(bookingStatus)) {
    return res.status(400).json({ message: "status must be PENDING, CONFIRMED, or CANCELED" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user.role === "CLIENT" && event.clientId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const usher = await prisma.usher.findUnique({
      where: { id: usherId },
    });

    if (!usher) {
      return res.status(404).json({ message: "Usher not found" });
    }

    const eventDate = new Date(event.date);
    const from = new Date(eventDate.getTime() - 4 * 60 * 60 * 1000);
    const to = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000);

    const overlapping = await prisma.booking.findFirst({
      where: {
        usherId,
        status: { in: ["PENDING", "CONFIRMED"] },
        event: {
          date: { gte: from, lte: to },
        },
      },
      include: { event: true },
    });

    if (overlapping) {
      return res.status(409).json({
        message: "Usher has a conflicting booking window",
        conflictEventId: overlapping.eventId,
      });
    }

    const booking = await prisma.booking.create({
      data: {
        eventId,
        usherId,
        status: bookingStatus,
      },
      include: {
        event: true,
        usher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json(booking);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "This usher is already booked for this event" });
    }
    return res.status(500).json({ message: "Failed to create booking", details: error.message });
  }
});

router.get("/event/:eventId", requireAuth, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user.role === "CLIENT" && event.clientId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const bookings = await prisma.booking.findMany({
      where: { eventId: req.params.eventId },
      include: {
        usher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bookings", details: error.message });
  }
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  const { status } = req.body;
  const nextStatus = String(status || "").toUpperCase();

  if (!nextStatus) {
    return res.status(400).json({ message: "status is required" });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        event: true,
        usher: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.user.role === "CLIENT") {
      if (booking.event.clientId !== req.user.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (!CLIENT_ALLOWED_STATUSES.includes(nextStatus)) {
        return res.status(400).json({ message: `status must be one of ${CLIENT_ALLOWED_STATUSES.join(", ")}` });
      }
    } else if (req.user.role === "USHER") {
      const usher = await prisma.usher.findUnique({
        where: { userId: req.user.userId },
      });
      if (!usher || usher.id !== booking.usherId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (!USHER_ALLOWED_STATUSES.includes(nextStatus)) {
        return res.status(400).json({ message: `status must be one of ${USHER_ALLOWED_STATUSES.join(", ")}` });
      }
    } else if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: { status: nextStatus },
      });

      const nextReliability = applyReliabilityDelta(
        booking.usher.reliabilityScore,
        booking.status,
        nextStatus
      );

      if (nextReliability !== booking.usher.reliabilityScore) {
        await tx.usher.update({
          where: { id: booking.usherId },
          data: { reliabilityScore: nextReliability },
        });
      }

      return { updatedBooking, nextReliability };
    });

    return res.json({
      booking: updated.updatedBooking,
      reliabilityScore: updated.nextReliability,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update booking status", details: error.message });
  }
});

module.exports = router;
