import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import ServicePackageSection from "../../components/services/ServicePackageSection";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import LoginPromptModal from '../../components/common/LoginPromptModal';
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";

function Grooming() {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const handleBookNow = () => {
    if (user) {
      navigate("/book-service", { state: { defaultService: "Grooming" } });
    } else {
      setShowLoginPrompt(true);
    }
  };

  const faqs = [
    {
      question: "How often should my dog be groomed?",
      answer: "It depends on the breed and coat type. Most dogs benefit from grooming every 4–6 weeks to keep their coat healthy and free from tangles or matting.",
    },
    {
      question: "Do you offer grooming for all breeds?",
      answer: "Yes, we offer grooming services for all dog breeds — small to large — and tailor our services to their coat and skin needs.",
    },
    {
      question: "What does a full grooming session include?",
      answer: "A full session includes bathing, brushing, haircut/styling, nail trimming, ear cleaning, and a final check to ensure your dog is comfortable and happy.",
    },
    {
      question: "Can I stay during the grooming session?",
      answer: "For the safety of your pet and our groomers, we recommend dropping off and picking up after the session, but we’ll always keep you updated.",
    },
    {
      question: "How do I prepare my dog for their first grooming appointment?",
      answer: "Bring your dog’s vaccination records and let us know of any sensitivities or special needs. A quick walk before drop-off also helps ease anxiety.",
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
        <title>Grooming - Kisite Canines</title>
        <meta name="description" content="Learn more about our dog grooming services at Kisite Canines." />
      </Helmet>

      <div className="grooming-container">

        {/* Hero Section */}
<section className="grooming-hero bg-[#EAEAE8] py-16 px-4 md:px-12">
  {/* Top Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-center mt-6">
    
    {/* Left Image Pair */}
    <motion.div
      className="flex flex-row gap-4"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      data-aos="fade-right"
    >
      <img src="/images/grooming1.jpg" alt="Grooming 1" className="rounded-lg shadow-md object-cover w-1/2 h-48 md:h-56" />
      <img src="/images/grooming2.jpg" alt="Grooming 2" className="rounded-lg shadow-md object-cover w-1/2 h-48 md:h-56" />
    </motion.div>

    {/* Center Title */}
    <motion.div
      className="text-center px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true }}
      data-aos="zoom-in"
    >
      <h1 className="text-2xl md:text-4xl font-bold text-[#303A40] leading-snug">
        Premium Dog Grooming Services<br />Tailored to Every Breed
      </h1>
    </motion.div>

    {/* Right Image */}
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      data-aos="fade-left"
    >
      <img src="/images/grooming3.jpg" alt="Grooming Right" className="rounded-lg shadow-md object-cover w-full h-full max-h-[400px]" />
    </motion.div>
  </div>

  {/* Bottom Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
    
    {/* Left Image */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      data-aos="fade-right"
    >
      <img src="/images/grooming1.jpg" alt="Dog Grooming" className="rounded-lg shadow-md object-cover w-full h-full max-h-[400px]" />
    </motion.div>

    {/* Center Text + Button */}
    <motion.div
      className="text-center md:text-left px-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      viewport={{ once: true }}
      data-aos="fade-up"
    >
      <p className="text-[#4F6866] text-lg mb-4">
        Our grooming experts use gentle, breed-specific techniques to ensure your dog not only looks great but feels happy and relaxed after every session.
      </p>
      <div className="flex justify-center md:justify-start">
        <motion.button
          onClick={handleBookNow}
          className="bg-[#D7CD43] text-[#303A40] px-6 py-3 rounded shadow hover:bg-[#C5BC39] transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>

    {/* Right Image Pair */}
    <motion.div
      className="flex flex-row gap-4"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      data-aos="fade-left"
    >
      <img src="/images/grooming2.jpg" alt="Grooming 5" className="rounded-lg shadow-md object-cover w-1/2 h-48 md:h-56" />
      <img src="/images/grooming3.jpg" alt="Grooming 6" className="rounded-lg shadow-md object-cover w-1/2 h-48 md:h-56" />
    </motion.div>
  </div>
</section>


        {/* Overview */}
<section
  className="bg-[#303A40] py-16 px-6 md:px-12"
  data-aos="fade-up"
>
  <motion.div
    className="max-w-4xl mx-auto text-center"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    viewport={{ once: true }}
  >
    <h2 className="text-3xl md:text-4xl font-bold text-[#EAEAE9] mb-6">
      Why Grooming Matters
    </h2>
    <p className="text-[#EAEAE6] text-lg leading-relaxed">
      Regular grooming is essential for your dog's health and happiness. It helps prevent matting, reduces shedding, and keeps their skin and coat healthy.
      Our team is trained in the latest grooming techniques to ensure your dog receives the best care possible.
    </p>
  </motion.div>
</section>


        {/* Packages */}
        <ServicePackageSection service="Grooming" />

        {/* FAQs */}
<section
  className="px-6 md:px-16 py-16 bg-[#EAEAE8]"
  data-aos="fade-up"
>
  <motion.div
    className="max-w-4xl mx-auto"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    viewport={{ once: true }}
  >
    <h2 className="text-3xl font-bold text-center mb-10 text-[#303A40]">
      Frequently Asked Questions
    </h2>
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          className="border-b border-[#9BAFAF] pb-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <h3 className="text-lg font-semibold text-[#4F6866]">
              {faq.question}
            </h3>
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
  </motion.div>
</section>


        {/* CTA */}
<section
  className="bg-[#4F6866] text-center py-16 px-6"
  data-aos="zoom-in"
>
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    <h2 className="text-3xl font-bold mb-4 text-[#EAEAE8]">
      Ready to Pamper Your Pup?
    </h2>
    <p className="text-lg text-[#EAEAE8] mb-6 max-w-xl mx-auto">
      Book your grooming appointment today and give your dog the care they deserve. Our team is ready to provide a relaxing and enjoyable experience for your furry friend.
    </p>
    <motion.button
      onClick={handleBookNow}
      className="bg-[#D7CD43] text-[#303A40] px-6 py-3 rounded shadow hover:bg-[#C5BC39] transition"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      viewport={{ once: true }}
    >
      Book Now
    </motion.button>
  </motion.div>
</section>

      </div>
    </>
  );
}

export default Grooming;
