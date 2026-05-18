const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRoles } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireRoles("ADMIN"));

router.get("/ops/summary", async (req, res) => {
  const days = Math.min(Number(req.query.days) || 7, 90);
  const now = new Date();
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  try {
    const [events, bookings, checkins, ratings] = await Promise.all([
      prisma.event.count({ where: { createdAt: { gte: since } } }),
      prisma.booking.count({ where: { createdAt: { gte: since } } }),
      prisma.checkin.count({ where: { createdAt: { gte: since } } }),
      prisma.rating.count({ where: { createdAt: { gte: since } } }),
    ]);

    const noShows = await prisma.booking.count({
      where: {
        status: "NO_SHOW",
        createdAt: { gte: since },
      },
    });

    const activeEvents = await prisma.event.count({
      where: {
        status: { in: ["OPEN", "LIVE"] },
      },
    });

    return res.json({
      periodDays: days,
      since: since.toISOString(),
      generatedAt: now.toISOString(),
      metrics: {
        events,
        activeEvents,
        bookings,
        noShows,
        checkins,
        ratings,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch ops summary", details: error.message });
  }
});

router.get("/alerts/no-shows", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  try {
    const alerts = await prisma.booking.findMany({
      where: { status: "NO_SHOW" },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            client: {
              select: { id: true, name: true, email: true },
            },
          },
        },
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
      total: alerts.length,
      alerts,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch no-show alerts", details: error.message });
  }
});

router.get("/ushers/reliability", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);

  try {
    const ushers = await prisma.usher.findMany({
      orderBy: [{ reliabilityScore: "asc" }, { rating: "asc" }],
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: {
            bookings: true,
            ratings: true,
            checkins: true,
          },
        },
      },
    });

    return res.json({
      total: ushers.length,
      leaderboard: ushers.map((usher) => ({
        usherId: usher.id,
        user: usher.user,
        rating: usher.rating,
        reliabilityScore: usher.reliabilityScore,
        bookingsCount: usher._count.bookings,
        ratingsCount: usher._count.ratings,
        checkinsCount: usher._count.checkins,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reliability leaderboard", details: error.message });
  }
});

module.exports = router;

