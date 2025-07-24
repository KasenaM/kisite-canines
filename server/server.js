const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");

// 🔐 Load environment variables
dotenv.config();

// 🚀 Create Express app
const app = express();

// ✅ Middlewares
app.use(cors({
  origin: "http://localhost:3000", // your React frontend
  credentials: true
}));

app.use(express.json()); // to parse JSON bodies

// ✅ Routes
console.log("🛣️ Mounting contact routes...");
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
