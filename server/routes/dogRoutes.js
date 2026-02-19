const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const Dog = require("../models/Dog");
const authMiddleware = require("../middleware/authMiddleware");
const { validateDogRequest } = require("../middleware/dogMiddleware");


const storage = multer.diskStorage({
  destination(req, file, cb) {
    
    cb(null, path.join(__dirname, "../uploads/dogs"));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });


router.get("/ping", (req, res) => {
  res.status(200).send("dogs pong 🐕");
});


router.get("/", authMiddleware, async (req, res) => {
  try {
    const dogs = await Dog.find({ ownerId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(dogs);
  } catch (err) {
    console.error("❌ Error fetching dogs:", err);
    res.status(500).json({ message: "Server error while fetching dogs." });
  }
});


router.post(
  "/",
  authMiddleware,          
  upload.single("image"),   
  validateDogRequest,      
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Dog image is required." });
      }

      const { name, breed, age, gender } = req.body;

      const dog = new Dog({
        ownerId: req.userId,             
        source: "client",
        name,
        breed,
        age,
        gender,
        image: `uploads/dogs/${req.file.filename}`, 
      });

      await dog.save();

      res.status(201).json({
        message: "Dog added successfully.",
        dog,
      });
    } catch (err) {
      console.error("❌ Error saving dog:", err);
      res.status(500).json({
        message: "Server error while adding dog.",
      });
    }
  }
);


router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, breed, age, gender } = req.body;

  
    let dog = await Dog.findOne({ _id: id, ownerId: req.userId });

    if (!dog) {
      return res.status(404).json({ message: "Dog not found or unauthorized." });
    }

   
    const updateData = {
      name: name ? name.trim() : dog.name,
      breed: breed || dog.breed,
      age: age || dog.age,
      gender: gender || dog.gender,
    };

   
    if (req.file) {
      updateData.image = `uploads/dogs/${req.file.filename}`;
    }

   
    dog = await Dog.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: "Dog updated successfully.",
      dog,
    });
  } catch (err) {
    console.error("❌ Error updating dog:", err);
    res.status(500).json({ message: "Server error while updating dog." });
  }
});


router.post("/shop", upload.single("image"), async (req, res) => {
  try {
    const { ownerId, name, breed, age, gender } = req.body;

    if (!name || !breed || !age || !gender || !req.file) {
      return res.status(400).json({ message: "Incomplete dog details." });
    }

    const dog = new Dog({
      ownerId: ownerId || null,
      source: "shop",
      name: name.trim(),
      breed: breed.trim(),
      age: age.trim(),
      gender,
      image: `uploads/dogs/${req.file.filename}`,
    });

    await dog.save();

    res.status(201).json({
      message: "Purchased dog saved successfully.",
      dog,
    });
  } catch (err) {
    console.error("❌ Error saving shop dog:", err);
    res.status(500).json({
      message: "Server error while saving purchased dog.",
    });
  }
});

module.exports = router;