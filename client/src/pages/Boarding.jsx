import  { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import ServicePackageSection from '../components/ServicePackageSection';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoginPromptModal from '../components/LoginPromptModal';
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";

function Boarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const handleBookNow = () => {
    if (user) {
      navigate("/book-service", { state: { defaultService: "Boarding" } });
    } else {
      setShowLoginPrompt(true);
    }
  };

  const faqs = [
    {
      question: "What should I bring for my dog’s stay?",
      answer: "You can bring your dog’s food, medication, a favorite toy, and bedding to make them feel at home. We also provide essentials if needed.",
    },
    {
      question: "Can I check in on my dog during their stay?",
      answer: "Yes, we offer photo and video updates via WhatsApp so you can stay connected and see how your dog is doing.",
    },
    {
      question: "Are dogs supervised overnight?",
      answer: "Absolutely. Our staff is present 24/7 to ensure all dogs are safe, comfortable, and cared for—even overnight.",
    },
    {
      question: "What vaccinations are required?",
      answer: "All dogs must be up-to-date on core vaccines including rabies, DHPP, and Bordetella. Proof of vaccination is required before boarding.",
    },
    {
      question: "Do you accommodate dogs with medical conditions?",
      answer: "Yes, we can administer medication and follow specific routines with guidance. Just let us know the details in advance.",
    },
  ];

  return (
    <Layout>
      <LoginPromptModal
        visible={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        message="Please log in or sign up to proceed with service booking."
      />

      <Helmet>
        <title>Boarding - Kisite Canines</title>
        <meta name="description" content="Learn more about our dog boarding services at Kisite Canines." />
      </Helmet>

      {/* Hero Section */}
<section
  className="bg-[#EAEAE8] py-16 px-4 md:px-12 h-[600px]"
  data-aos="fade-up"
>
  <motion.div
    className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-6"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    <motion.div
      className="text-center md:text-left"
      initial={{ x: -40, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <h1 className="text-3xl md:text-4xl font-bold text-[#303A40] mb-6 leading-snug">
        Comfortable, Safe & Caring<br className="hidden md:block" /> Dog Boarding
      </h1>
      <motion.button
        onClick={handleBookNow}
        className="bg-[#D7CD43] text-[#303A40] px-6 py-3 rounded shadow hover:bg-[#C5BC39] transition"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        viewport={{ once: true }}
      >
        Book Now
      </motion.button>
    </motion.div>

    <motion.div
      className="flex flex-col items-center md:items-start text-center md:text-left"
      initial={{ x: 40, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <img
        src="/images/boarding1.jpg"
        alt="Happy boarded dog"
        className="rounded-lg shadow-md object-cover w-full max-h-[350px] mb-6"
      />
      <p className="text-[#4F6866] text-lg leading-relaxed">
        Whether it's for a day, a weekend, or an extended stay, your dog will enjoy personalized care, regular walks, and a cozy space to relax while you're away.
      </p>
    </motion.div>
  </motion.div>
</section>


      {/* Why Choose Our Boarding */}
<section className="bg-[#F7F7F5] py-16 px-6 md:px-12" data-aos="fade-up" data-aos-duration="800">
  <motion.h2
    className="text-3xl md:text-4xl font-bold text-center text-[#303A40] mb-12"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    Why Choose Our Boarding?
  </motion.h2>

  <motion.div
    className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto mb-12"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    viewport={{ once: true }}
  >
    {[
      {
        title: "Personalized Routines",
        desc: "Feeding, walks, and medications follow your dog’s home schedule, ensuring continuity and comfort.",
        iconPath: <path d="M21 10c0 8-9 13-9 13S3 18 3 10a9 9 0 0118 0z" />,
        iconExtra: <circle cx="12" cy="10" r="3" />,
      },
      {
        title: "Play & Socialization",
        desc: "Daily group or solo play sessions to keep your dog happy, active, and socially engaged.",
        iconPath: <circle cx="12" cy="12" r="10" />,
        iconExtra: <line x1="8" y1="15" x2="16" y2="9" />,
      },
      {
        title: "24/7 Supervision",
        desc: "Trained caregivers are present at all times, monitoring your dog’s comfort and safety around the clock.",
        iconPath: <circle cx="12" cy="12" r="10" />,
        iconExtra: <path d="M12 6v6l4 2" />,
      },
      {
        title: "Comfortable Sleeping Areas",
        desc: "Soft bedding, calming ambiance, and clean private spaces help your dog rest peacefully.",
        iconPath: <path d="M3 7v13h18V7" />,
        iconExtra: (
          <>
            <path d="M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2" />
            <path d="M9 14h6" />
          </>
        ),
      },
    ].map((item, idx) => (
      <motion.div
        key={idx}
        className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: idx * 0.1 }}
        viewport={{ once: true }}
      >
        <div className="text-[#D7CD43] w-12 h-12 flex-shrink-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {item.iconPath}
            {item.iconExtra}
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#303A40] mb-1">{item.title}</h3>
          <p className="text-[#4F6866] text-sm">{item.desc}</p>
        </div>
      </motion.div>
    ))}
  </motion.div>

  <motion.p
    className="text-center text-[#4F6866] text-lg max-w-3xl mx-auto leading-relaxed"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    viewport={{ once: true }}
  >
    Whether it’s playtime, bedtime, or mealtime — our personalized approach ensures your dog feels at ease and cared for.
    Choose <strong className="text-[#303A40]">Kisite Canines</strong> for boarding that feels just like home.
  </motion.p>
</section>


      {/* Service Packages */}
      <ServicePackageSection service="Boarding" />

      {/* FAQs */}
<motion.section
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="px-6 md:px-16 py-16 bg-[#EAEAE8]"
>
  <h2 className="text-3xl font-bold text-center mb-10 text-[#303A40]">
    Frequently Asked Questions
  </h2>

  <div className="space-y-6 max-w-4xl mx-auto">
    {faqs.map((faq, index) => (
      <div
        key={index}
        className="border-b border-[#9BAFAF] pb-4"
        data-aos="fade-up"
        data-aos-delay={index * 100}
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
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-[#4F6866]"
          >
            {faq.answer}
          </motion.p>
        )}
      </div>
    ))}
  </div>
</motion.section>


      {/* CTA */}
<motion.section
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="text-center bg-[#4F6866] py-16 px-6"
>
  <h2
    className="text-3xl font-bold mb-4 text-[#EAEAE8]"
    data-aos="fade-up"
  >
    Ready to Book a Stay?
  </h2>

  <p
    className="text-lg text-[#EAEAE8] mb-6 max-w-xl mx-auto"
    data-aos="fade-up"
    data-aos-delay="100"
  >
    Whether it's a weekend getaway or a long trip, give your dog a safe and comforting home away from home. Reach out now to reserve their spot!
  </p>

  <div data-aos="fade-up" data-aos-delay="200">
    <button
      onClick={handleBookNow}
      className="bg-[#D7CD43] text-[#303A40] px-6 py-3 rounded shadow hover:bg-[#C5BC39] transition"
    >
      Book Now
    </button>
  </div>
</motion.section>

    </Layout>
  );
}

export default Boarding;
