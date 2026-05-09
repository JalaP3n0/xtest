const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/profile", requireAuth, requireRoles("CLIENT", "ADMIN"), async (req, res) => {
  const { companyName, jobTitle, industry, website, bio, phone } = req.body;

  try {
    // Update User fields
    if (phone) {
      await prisma.user.update({
        where: { id: req.user.userId },
        data: {
          phone: phone || undefined,
        },
      });
    }

    const profile = await prisma.clientProfile.upsert({
      where: { userId: req.user.userId },
      update: {
        companyName: companyName || undefined,
        jobTitle: jobTitle || undefined,
        industry: industry || null,
        website: website || null,
        bio: bio || null,
      },
      create: {
        userId: req.user.userId,
        companyName: companyName || "",
        jobTitle: jobTitle || "",
        industry: industry || null,
        website: website || null,
        bio: bio || null,
      },
    });

    return res.status(201).json(profile);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save client profile", details: error.message });
  }
});

module.exports = router;
