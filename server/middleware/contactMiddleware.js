const rateLimitMap = new Map(); 

const validateContactRequest = (req, res, next) => {
  const { fullName, email, phone, subject, message } = req.body;

  if (
    !fullName?.trim() ||
    !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(fullName.trim()) ||
    !email?.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !phone?.trim() ||
    phone.trim().length < 7 ||
    !subject?.trim() ||
    !message?.trim() ||
    message.trim().length < 20
  ) {
    return res.status(400).json({ message: "Invalid or incomplete form submission." });
  }

 
  req.body.fullName = fullName.trim();
  req.body.email = email.trim();
  req.body.phone = phone.trim();
  req.body.subject = subject.trim();
  req.body.message = message.trim();

  next();
};

const limitContactSubmissions = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowTime = 60 * 1000; 
  const maxRequests = 3;

  const timestamps = rateLimitMap.get(ip) || [];

  const filteredTimestamps = timestamps.filter((t) => now - t < windowTime);
  filteredTimestamps.push(now);

  if (filteredTimestamps.length > maxRequests) {
    return res.status(429).json({ message: "Too many contact submissions. Please wait and try again." });
  }

  rateLimitMap.set(ip, filteredTimestamps);
  next();
};

module.exports = {
  validateContactRequest,
  limitContactSubmissions,
};
