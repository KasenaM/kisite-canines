// server/middleware/verifyRecaptcha.js
const axios = require("axios");

const verifyRecaptcha = async (req, res, next) => {
  const token = req.body.recaptchaToken;

  if (!token) {
    return res.status(400).json({ message: "reCAPTCHA token missing" });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    const { success, score, action } = response.data;

    if (!success || (score && score < 0.5)) {
      return res.status(400).json({ message: "Failed reCAPTCHA validation" });
    }

    next();
  } catch (err) {
    console.error("reCAPTCHA verification error:", err.message);
    res.status(500).json({ message: "reCAPTCHA verification failed" });
  }
};

module.exports = verifyRecaptcha;
