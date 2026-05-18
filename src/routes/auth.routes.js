const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const prisma = require("../lib/prisma");
const { jwtSecret } = require("../config/env");

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return 200 even if user doesn't exist for security reasons (prevents email enumeration)
      return res.json({ message: "If an account exists with this email, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    // In a real app, send email here. For now, log to console.
    const resetUrl = `http://localhost:3000/reset-password?token=${token}&email=${email}`;
    console.log("-----------------------");
    console.log("PASSWORD RESET REQUEST");
    console.log(`User: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("-----------------------");

    return res.json({ message: "If an account exists with this email, a reset link has been sent." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to process request", details: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: "Email, token, and new password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.resetToken !== token || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.json({ message: "Password reset successful. You can now log in with your new password." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reset password", details: error.message });
  }
});

router.post("/signup", async (req, res) => {
  const { name, nickname, email, password, phone, gender, role, companyName, jobTitle } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }

  const normalizedRole = (role || "CLIENT").toUpperCase();
  if (!["CLIENT", "USHER", "ADMIN"].includes(normalizedRole)) {
    return res.status(400).json({ message: "role must be CLIENT, USHER, or ADMIN" });
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Use a transaction to ensure both User and ClientProfile are created together
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          nickname: normalizedRole === "USHER" ? nickname : undefined,
          email,
          password: hashedPassword,
          phone,
          gender: normalizedRole === "USHER" ? gender : undefined,
          role: normalizedRole,
        },
      });

      if (normalizedRole === "CLIENT" && companyName && jobTitle) {
        await tx.clientProfile.create({
          data: {
            userId: newUser.id,
            companyName,
            jobTitle,
          },
        });
      }

      return tx.user.findUnique({
        where: { id: newUser.id },
        select: {
          id: true,
          name: true,
          nickname: true,
          email: true,
          phone: true,
          gender: true,
          role: true,
          createdAt: true,
          clientProfile: true,
        },
      });
    });

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "2h" }
    );

    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: "Failed to signup", details: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "2h" }
    );

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login", details: error.message });
  }
});

module.exports = router;

