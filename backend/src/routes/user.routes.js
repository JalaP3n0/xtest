const express = require("express");
const multer = require("multer");
const path = require("path");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
    }
  }
});

router.post("/upload-photo", requireAuth, upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const photoUrl = `/uploads/${req.file.filename}`;
  
  try {
    return res.json({ photoUrl });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload photo", details: error.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        nickname: true,
        email: true,
        phone: true,
        gender: true,
        role: true,
        createdAt: true,
        usher: {
          select: {
            bio: true,
            experience: true,
            profilePhoto: true,
            languages: true,
            rating: true,
            reliabilityScore: true,
          }
        },
        clientProfile: {
          select: {
            companyName: true,
            jobTitle: true,
            industry: true,
            website: true,
            bio: true,
          }
        }
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile", details: error.message });
  }
});

module.exports = router;

