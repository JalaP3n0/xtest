const express = require("express");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const usherRoutes = require("./routes/usher.routes");
const clientRoutes = require("./routes/client.routes");
const eventRoutes = require("./routes/event.routes");
const bookingRoutes = require("./routes/booking.routes");
const checkinRoutes = require("./routes/checkin.routes");
const trackingRoutes = require("./routes/tracking.routes");
const ratingRoutes = require("./routes/rating.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/ushers", usherRoutes);
app.use("/clients", clientRoutes);
app.use("/events", eventRoutes);
app.use("/bookings", bookingRoutes);
app.use("/checkins", checkinRoutes);
app.use("/tracking", trackingRoutes);
app.use("/ratings", ratingRoutes);
app.use("/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
