import  {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicePackageSection from "../../components/services/ServicePackageSection";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import LoginPromptModal from '../../components/common/LoginPromptModal';
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";

function Training() {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const handleBookNow = () => {
    if (user) {
      navigate("/book-service", { state: { defaultService: "Training" } });
    } else {
      setShowLoginPrompt(true);
    }
  };

  const faqs = [
    {
      question: "What age should I start training my puppy?",
      answer: "It's best to start training your puppy as early as 8 weeks old. Early socialization and basic obedience training can help prevent behavioral issues later on.",
    },
    {
      question: "How long are the training sessions?",
      answer: "Training sessions typically last 1 hour. We recommend shorter, more frequent sessions for puppies and longer sessions for adult dogs.",
    },
    {
      question: "Do you offer group classes?",
      answer: "Yes, we offer group classes for various training programs. Group classes provide a great opportunity for socialization and learning in a controlled environment.",
    },
    {
      question: "Can you help with aggressive behavior?",
      answer: "Absolutely. Our behavioral correction program addresses issues like aggression, anxiety, and fear-based behaviors through personalized strategies.",
    },
    {
      question: "Are private sessions available?",
      answer: "Yes, we offer one-on-one training sessions tailored to your dog’s needs and your specific goals.",
    },
  ];

  return (
    <>
      <LoginPromptModal
        visible={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        message="Please log in or sign up to proceed with service booking."
      />

      <Helmet>
        <title>Training - Kisite Canines</title>
        <meta name="description" content="Learn more about our dog training services at Kisite Canines." />
      </Helmet>

      <div className="training-container">
        {/* Hero Section */}
<section className="relative w-full h-[600px] flex items-center justify-center mt-18 overflow-hidden">
  {/* Background image */}
  <div
    className="absolute w-full h-full bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/images/training-hero-bg.jpeg')" }}
  ></div>

  {/* Overlay */}
  <div className="absolute w-full h-full bg-black/50"></div>

  {/* Foreground content with AOS */}
  <div
    className="relative z-10 text-center px-4"
    data-aos="fade-up"
    data-aos-duration="1000"
  >
    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-snug">
      Train with Compassion, Lead with Confidence
    </h1>
    <p className="text-base sm:text-lg text-white mb-6 max-w-2xl mx-auto">
      From basic obedience to behavior correction — our training experts are here to guide your dog's growth.
    </p>
    <button
      onClick={handleBookNow}
      className="bg-[#D7CD43] text-[#303A40] px-6 py-3 rounded shadow hover:bg-[#C5BC39] transition"
    >
      Book Now
    </button>
  </div>
</section>


        {/* Overview */}
<section className="training-overview bg-white py-16 px-6">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
    
    {/* Left Image with Framer Motion and AOS */}
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      data-aos="fade-right"
    >
      <img
        src="/images/trainingdog1.jpg"
        alt="Dog training"
        className="rounded-lg shadow-lg w-full h-auto object-cover"
      />
    </motion.div>

    {/* Center Text */}
    <motion.div
      className="flex-1 text-center md:text-left px-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      data-aos="fade-up"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-[#303A40] mb-4">
        Why Training Matters
      </h2>
      <p className="text-[#4F6866] text-lg leading-relaxed">
        Training is essential for your dog's development and overall well-being. It builds obedience, confidence, and social skills while strengthening the bond between you and your pet—ensuring a happy, balanced, and well-mannered companion.
      </p>
    </motion.div>

    {/* Right Image with Framer Motion and AOS */}
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      data-aos="fade-left"
    >
      <img
        src="/images/trainingdog2.jpg"
        alt="Training session"
        className="rounded-lg shadow-lg w-full h-auto object-cover"
      />
    </motion.div>
  </div>
</section>


        <ServicePackageSection service="Training" />

        {/* FAQs */}
<section className="training-faqs px-6 md:px-16 py-16 bg-[#EAEAE8]">
  <motion.h2
    className="text-3xl font-bold text-center mb-10 text-[#303A40]"
    initial={{ opacity: 0, y: -30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    data-aos="fade-down"
  >
    Frequently Asked Questions
  </motion.h2>

  <div className="space-y-6 max-w-4xl mx-auto">
    {faqs.map((faq, index) => (
      <motion.div
        key={index}
        className="faq-item border-b border-gray-200 pb-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        data-aos="fade-up"
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleFAQ(index)}
        >
          <h3 className="text-lg font-semibold text-[#303A40]">{faq.question}</h3>
          <span className="text-[#D7CD43]">
            {openIndex === index ? <FaMinus /> : <FaPlus />}
          </span>
        </div>
        {openIndex === index && (
          <p className="mt-3 text-[#4F6866]">{faq.answer}</p>
        )}
      </motion.div>
    ))}
  </div>
</section>
        

        {/* CTA */}
<section className="training-call-to-action bg-[#4F6866] text-center py-16 px-6">
  <motion.h2
    className="text-3xl font-bold mb-4 text-[#EAEAE8]"
    initial={{ opacity: 0, y: -30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    data-aos="fade-down"
  >
    Ready to Get Started?
  </motion.h2>

  <motion.p
    className="text-lg text-[#EAEAE8] mb-6 max-w-xl mx-auto"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    viewport={{ once: true }}
    data-aos="fade-up"
  >
    Contact us today to schedule your dog's training consultation and take the first step towards a well-behaved companion!
  </motion.p>

  <motion.button
    onClick={handleBookNow}
    className="cta-button bg-[#D7CD43] text-[#303A40] px-6 py-2 rounded hover:bg-[#C5BC39] transition"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    viewport={{ once: true }}
    data-aos="zoom-in"
  >
    Book Now
  </motion.button>
</section>

      </div>
    </>
  );
}

export default Training;
