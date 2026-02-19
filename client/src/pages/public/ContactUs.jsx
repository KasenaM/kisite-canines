import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { User, Mail, MessageSquare, Tag, Send, AlertCircle, X } from "lucide-react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

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
  const [recaptchaKey, setRecaptchaKey] = useState(0); // Used to force reset ReCAPTCHA
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  // Handle local storage for draft saving
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

  // Toast Auto-hide
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (msg, type = "error") => {
    setToast({ show: true, message: msg, type });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName.trim() || !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(fullName.trim())) {
      newErrors.fullName = "Valid name required.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Valid email required.";
    }
    if (!phone || phone.length < 7) {
      newErrors.phone = "Valid phone required.";
    }
    if (!subject) {
      newErrors.subject = "Subject is required.";
    }
    if (subject === "Other" && !customSubject.trim()) {
      newErrors.customSubject = "Specify subject.";
    }
    if (!message.trim() || message.trim().length < 20) {
      newErrors.message = "Minimum 20 characters required.";
    }

    setErrors(newErrors);

    // Show field errors first
    if (Object.keys(newErrors).length > 0) return false;

    // Check ReCAPTCHA after field validation
    if (!recaptchaToken) {
      showToast("Please complete the reCAPTCHA verification.");
      return false;
    }

    return true;
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
        
        // Reset Logic
        setFullName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setCustomSubject("");
        setMessage("");
        setRecaptchaToken("");
        setRecaptchaKey(prev => prev + 1); // This resets the ReCAPTCHA widget
        localStorage.removeItem("contactFormData");

        // Timer to reset UI state and scroll up after 4 seconds
        setTimeout(() => {
          setSubmitted(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 4000);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      showToast("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Kisite Canines</title>
        <meta name="description" content="Get in touch with Kisite Canines for inquiries, feedback, or support." />
      </Helmet>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-[#4F6866] text-white px-6 py-4 rounded-xl shadow-2xl border border-white/10"
          >
            <AlertCircle size={20} className="text-[#D7CD43]" />
            <span className="font-bold text-sm uppercase tracking-wide">{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 hover:opacity-70">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-[#4F6866] text-white text-center py-20 mt-12 px-6"
      >
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
          Get in Touch
        </h2>
        <p className="text-gray-200 max-w-2xl mx-auto text-lg font-medium">
          Reach out and we’ll get back to you as soon as <span className="italic">pawsible</span>!
        </p>
      </motion.div>

      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Form Container */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="w-full lg:w-2/3 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[#4F6866] text-xs font-bold uppercase ml-1">
                        <User size={16} /> Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your Name"
                        className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                          errors.fullName ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-[#D7CD43]/50 focus:border-[#D7CD43]"
                        }`}
                      />
                      {errors.fullName && <p className="text-red-600 text-[10px] font-black uppercase ml-1 tracking-tighter">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[#4F6866] text-xs font-bold uppercase ml-1">
                        <Mail size={16} /> Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                          errors.email ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-[#D7CD43]/50 focus:border-[#D7CD43]"
                        }`}
                      />
                      {errors.email && <p className="text-red-600 text-[10px] font-black uppercase ml-1 tracking-tighter">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[#4F6866] text-xs font-bold uppercase ml-1">
                        <FaPhoneAlt size={14} /> Phone
                      </label>
                      <PhoneInput
                        country="ke"
                        value={phone}
                        onChange={setPhone}
                        enableSearch
                        inputClass={`!w-full !h-[48px] !bg-gray-50 !border !rounded-lg !pl-[58px] ${
                          errors.phone ? "!border-red-500" : "!border-gray-200"
                        }`}
                        buttonClass="!bg-gray-50 !border-gray-200 !rounded-l-lg"
                        dropdownClass="!rounded-lg"
                      />
                      {errors.phone && <p className="text-red-600 text-[10px] font-black uppercase ml-1 tracking-tighter mt-1">{errors.phone}</p>}
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[#4F6866] text-xs font-bold uppercase ml-1">
                        <Tag size={16} /> Subject
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 outline-none transition-all ${
                          errors.subject ? "border-red-500" : "border-gray-200 focus:ring-[#D7CD43]/50 focus:border-[#D7CD43]"
                        }`}
                      >
                        <option value="">Choose one...</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Booking Request">Booking Request</option>
                        <option value="Complaint">Complaint</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.subject && <p className="text-red-600 text-[10px] font-black uppercase ml-1 tracking-tighter">{errors.subject}</p>}
                    </div>
                  </div>

                  {subject === "Other" && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
                      <input
                        type="text"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder="Please specify subject"
                        className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 outline-none ${
                          errors.customSubject ? "border-red-500" : "border-gray-200 focus:ring-[#D7CD43]"
                        }`}
                      />
                      {errors.customSubject && <p className="text-red-600 text-[10px] font-black uppercase ml-1">{errors.customSubject}</p>}
                    </motion.div>
                  )}

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[#4F6866] text-xs font-bold uppercase ml-1">
                      <MessageSquare size={16} /> Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows="5"
                      placeholder="How can we help you today?"
                      className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 outline-none resize-none transition-all ${
                        errors.message ? "border-red-500" : "border-gray-200 focus:ring-[#D7CD43]/50 focus:border-[#D7CD43]"
                      }`}
                    ></textarea>
                    {errors.message && <p className="text-red-600 text-[10px] font-black uppercase ml-1 tracking-tighter">{errors.message}</p>}
                  </div>

                  {/* ReCAPTCHA Center - Uses key to reset */}
                  <div className="flex justify-center py-2 overflow-hidden">
                    <ReCAPTCHA
                      key={recaptchaKey}
                      sitekey="6LdwWXwrAAAAAJaWDlSAbe1ZXbqen0XcOyGT5YAJ"
                      onChange={(token) => setRecaptchaToken(token)}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#D7CD43] hover:bg-[#c4ba3d] text-[#303A40] py-4 rounded-xl font-black uppercase tracking-widest flex justify-center items-center gap-2 shadow-lg shadow-[#D7CD43]/20 transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 border-4 border-[#303A40]/30 border-t-[#303A40] rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <Send size={18} /> Send Message
                      </>
                    )}
                  </button>

                  {/* Success Message */}
                  <AnimatePresence>
                    {submitted && (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="p-4 bg-green-600 text-white rounded-lg text-center font-bold uppercase text-sm tracking-wider shadow-md"
                      >
                        ✅ Success! We'll get back to you shortly.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>

            {/* Sidebar Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/3 space-y-6"
            >
              <div className="bg-[#4F6866] p-8 rounded-2xl text-white shadow-xl">
                <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                  Office Info
                </h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#D7CD43] p-3 rounded-lg text-[#303A40]">
                      <FaPhoneAlt size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-300 uppercase">Call Us</p>
                      <p className="text-lg font-bold">+254 700 000 000</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-[#D7CD43] p-3 rounded-lg text-[#303A40]">
                      <FaEnvelope size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-300 uppercase">Email</p>
                      <a href="mailto:info@kisitecanines.com" className="text-lg font-bold hover:text-[#D7CD43] transition-colors">
                        info@kisitecanines.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-[#D7CD43] p-3 rounded-lg text-[#303A40]">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-300 uppercase">Visit</p>
                      <p className="text-lg font-bold leading-tight">Syokimau, Machakos, Kenya</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                <h4 className="text-[#303A40] font-black uppercase text-xs mb-4">Support Hours</h4>
                <div className="space-y-2 text-sm text-[#4F6866]">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Mon - Fri:</span>
                    <span className="font-bold text-[#303A40]">8 AM - 6 PM</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Sat - Sun:</span>
                    <span className="font-bold text-[#303A40]">9 AM - 4 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="px-4 md:px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl shadow-2xl border-4 border-white"
        >
          <iframe
            title="Kisite Canines Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.032486774614!2d36.9329!3d-1.3444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f7336a5360371%3A0xc3f982956799042c!2sSyokimau!5e0!3m2!1sen!2ske!4v1700000000000"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </section>
    </>
  );
}

export default ContactUs;