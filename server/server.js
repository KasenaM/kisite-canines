// server/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const dogRoutes = require("./routes/dogRoutes");
const paymentsRoutes = require("./routes/paymentsRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes")
const serviceInstancesRoutes =require("./routes/serviceInstancesRoutes")
const activityRoutes =require("./routes/activityRoutes")

// Initialize express
const app = express();

/* =========================
   DATABASE CONNECTION
========================= */
connectDB();

/* =========================
   MIDDLEWARE
========================= */

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FOLDER (UPLOADS)
========================= */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* =========================
   ROUTES
========================= */

// Base route test
app.get("/", (req, res) => {
  res.send("Kisite Canines API Running 🐶");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dogs", dogRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/analytics", analyticsRoutes);        
app.use("/api/service-instances", serviceInstancesRoutes); 
app.use("/api/activities", activityRoutes);        

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong on the server.",
  });
});

/* =========================
   SERVER START
========================= */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
