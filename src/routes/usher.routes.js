const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/profile", requireAuth, requireRoles("USHER", "ADMIN"), async (req, res) => {
  const { bio, experience, profilePhoto, languages, lat, lng, nickname, phone, gender } = req.body;

  try {
    // Update User model fields first if provided
    if (nickname || phone || gender) {
      await prisma.user.update({
        where: { id: req.user.userId },
        data: {
          nickname: nickname || undefined,
          phone: phone || undefined,
          gender: gender || undefined,
        },
      });
    }

    const profile = await prisma.usher.upsert({
      where: { userId: req.user.userId },
      update: {
        bio: bio || null,
        experience: experience || null,
        profilePhoto: profilePhoto || null,
        languages: languages || null,
        lat: typeof lat === "number" ? lat : null,
        lng: typeof lng === "number" ? lng : null,
      },
      create: {
        userId: req.user.userId,
        bio: bio || null,
        experience: experience || null,
        profilePhoto: profilePhoto || null,
        languages: languages || null,
        lat: typeof lat === "number" ? lat : null,
        lng: typeof lng === "number" ? lng : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            nickname: true,
            email: true,
            phone: true,
            gender: true,
          },
        },
      },
    });

    return res.status(201).json(profile);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save usher profile", details: error.message });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const ushers = await prisma.usher.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        rating: "desc",
      },
    });

    return res.json(ushers);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch ushers", details: error.message });
  }
});

module.exports = router;

