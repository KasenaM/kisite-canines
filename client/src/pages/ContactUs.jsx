import  { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function ContactUs() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");


  useEffect(() => {
    const saved = localStorage.getItem("contactFormData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFullName(parsed.fullName || "");
      setEmail(parsed.email || "");
      setPhone(parsed.phone || "");
      setSubject(parsed.subject || "");
      setCustomSubject(parsed.customSubject || "");
      setMessage(parsed.message || "");
    }
  }, []);

  useEffect(() => {
    const formData = { fullName, email, phone, subject, customSubject, message };
    localStorage.setItem("contactFormData", JSON.stringify(formData));
  }, [fullName, email, phone, subject, customSubject, message]);

  const validateForm = () => {
    const newErrors = {};
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(fullName.trim())) {
      newErrors.fullName = "Please enter a valid name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!phone || phone.length < 7) {
      newErrors.phone = "Enter a valid phone number.";
    }
    if (!subject) {
      newErrors.subject = "Subject is required.";
    }
    if (subject === "Other" && !customSubject.trim()) {
      newErrors.customSubject = "Specify the subject.";
    }
    if (!message.trim()) {
      newErrors.message = "Message is required.";
    } else if (message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);

    if (!validateForm()) return;

    setIsLoading(true);

    const payload = {
      fullName,
      email,
      phone,
      subject: subject === "Other" ? customSubject : subject,
      message,
      recaptchaToken
    };

    try {
      const res = await axios.post(`${API_BASE}/api/contact`, payload);
      if (res.status === 201) {
        setSubmitted(true);
        setFullName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setCustomSubject("");
        setMessage("");
        localStorage.removeItem("contactFormData");
      } else {
        alert("Submission failed. Try again later.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>

      <Helmet>
        <title>Contact Us - Kisite Canines</title>
        <meta name="description" content="Get in touch with Kisite Canines for inquiries, feedback, or support." />
      </Helmet>

<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="contact-page"
>
  <div className="text-center px-6 py-16 bg-[#EAEAE8] mt-6">
    <h2
      className="text-3xl md:text-4xl font-bold text-[#303A40] mb-4"
      data-aos="fade-up"
    >
      Contact Us
    </h2>

    <p
      className="text-[#4F6866] max-w-2xl mx-auto text-lg"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      Got a question or feedback? Reach out and we’ll get back to you as soon as <span className="italic">pawsible</span>!
    </p>
  </div>
</motion.div>


<motion.div
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  viewport={{ once: true }}
  className="flex flex-col md:flex-row gap-12 px-6 md:px-16 py-12 bg-white"
>
  {/* Contact Form */}
  <div className="w-full md:w-1/2" data-aos="fade-up">
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label className="block mb-1 text-[#4F6866]">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
            errors.fullName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#D7CD43]"
          }`}
        />
        {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1 text-[#4F6866]">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
            errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#D7CD43]"
          }`}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block mb-1 text-[#4F6866]">Phone</label>
        <PhoneInput
          country="ke"
          value={phone}
          onChange={setPhone}
          enableSearch
          inputProps={{
            name: "phone",
            required: true,
            autoComplete: "tel"
          }}
          inputClass={`!w-full !px-4 !py-2 !border !rounded-md focus:!outline-none focus:!ring-2 ${
            errors.phone ? "!border-red-500 focus:!ring-red-500" : "!border-gray-300 focus:!ring-[#D7CD43]"
          }`}
          containerClass="!w-full"
        />
        {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
      </div>

      {/* Subject */}
      <div>
        <label className="block mb-1 text-[#4F6866]">Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
            errors.subject ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#D7CD43]"
          }`}
        >
          <option value="">Select Subject</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Booking Request">Booking Request</option>
          <option value="Complaint">Complaint</option>
          <option value="Other">Other</option>
        </select>
        {errors.subject && <p className="text-sm text-red-600">{errors.subject}</p>}
        {subject === "Other" && (
          <>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="Specify subject"
              className={`mt-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.customSubject
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#D7CD43]"
              }`}
            />
            {errors.customSubject && <p className="text-sm text-red-600">{errors.customSubject}</p>}
          </>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block mb-1 text-[#4F6866]">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none ${
            errors.message ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#D7CD43]"
          }`}
        ></textarea>
        {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}
      </div>

      <ReCAPTCHA
        sitekey="6LdwWXwrAAAAAJaWDlSAbe1ZXbqen0XcOyGT5YAJ"
        onChange={(token) => setRecaptchaToken(token)}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#D7CD43] text-[#303A40] font-semibold px-6 py-2 rounded-md hover:bg-[#C5BC39] transition disabled:opacity-50"
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>

      {submitted && (
        <p className="mt-4 text-green-600 font-medium">✅ Thanks! We’ll get back to you shortly.</p>
      )}
    </form>
  </div>

  {/* Contact Info */}
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    viewport={{ once: true }}
    className="w-full md:w-1/2 space-y-8"
  >
    <div className="flex items-start gap-6" data-aos="fade-up">
      <FaPhoneAlt className="text-[#D7CD43] text-xl mt-1" />
      <div>
        <h3 className="text-lg font-bold text-[#303A40]">Call Us</h3>
        <p className="text-[#4F6866]">+254 700 000 000</p>
      </div>
    </div>

    <div className="flex items-start gap-6" data-aos="fade-up" data-aos-delay="100">
      <FaEnvelope className="text-[#D7CD43] text-xl mt-1" />
      <div>
        <h3 className="text-lg font-bold text-[#303A40]">Email</h3>
        <a href="mailto:info@kisitecanines.com" className="text-[#4F6866] hover:underline">
          info@kisitecanines.com
        </a>
      </div>
    </div>

    <div className="flex items-start gap-6" data-aos="fade-up" data-aos-delay="200">
      <FaMapMarkerAlt className="text-[#D7CD43] text-xl mt-1" />
      <div>
        <h3 className="text-lg font-bold text-[#303A40]">Visit Us</h3>
        <p className="text-[#4F6866]">Community Road, Syokimau, Machakos, Kenya</p>
      </div>
    </div>
  </motion.div>
</motion.div>


        {/* Map */}
<section
  data-aos="fade-up"
  className="mt-10 px-4 md:px-12"
>
  <div
    className="overflow-hidden rounded-xl shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <iframe
      title="Kisite Canines Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.6936914395415!2d36.94078097582794!3d-1.3604290357134268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f0d2863550d35%3A0x9a4a44f263f1193f!2sCommunity%20road%20syokimau!5e0!3m2!1sen!2ske!4v1751581711902!5m2!1sen!2ske"
      width="100%"
      height="500"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</section>

    </Layout>
  );
}

export default ContactUs;
