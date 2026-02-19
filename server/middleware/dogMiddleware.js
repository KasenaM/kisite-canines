// Validate and sanitize dog request body
const validateDogRequest = (req, res, next) => {
  const { name, breed, age, gender } = req.body;

  if (
    !name?.trim() ||
    !breed?.trim() ||
    !age?.trim() ||
    !["Male", "Female"].includes(gender)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid or incomplete dog details." });
  }

  // ✅ Sanitize inputs
  req.body.name = name.trim();
  req.body.breed = breed.trim();
  req.body.age = age.trim();
  req.body.gender = gender;

  next();
};

module.exports = { validateDogRequest };
