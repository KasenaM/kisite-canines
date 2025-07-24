import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'; // Adjust path if needed
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";


function About() {

const [currentVideo, setCurrentVideo] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentVideo((prev) => (prev === 0 ? 1 : 0));
  }, 5000); // switch every 10 seconds

  return () => clearInterval(interval);
}, []);


  return (
    <Layout>

      <Helmet>
        <title>About Us - Kisite Canines</title>
        <meta name="description" content="Learn more about Kisite Canines, our story, and our dedicated team." />
      </Helmet>

      <div className="about-container">
        {/* Hero Section */}
       
<section
  className="about-hero relative h-screen overflow-hidden text-white"
  data-aos="fade-in"
>
  {/* Background Videos */}
  <div className="absolute inset-0 z-0">
    {/* 👇 Fade switching between the two videos */}
    <video
      autoPlay
      loop
      muted
      className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
        currentVideo === 0 ? "opacity-70 z-10" : "opacity-0 z-0"
      }`}
    >
      <source src="/images/aboutbgvd.mp4" type="video/mp4" />
    </video>

    <video
      autoPlay
      loop
      muted
      className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
        currentVideo === 1 ? "opacity-70 z-10" : "opacity-0 z-0"
      }`}
    >
      <source src="/images/aboutbgvd2.mp4" type="video/mp4" />
    </video>

    <div className="absolute inset-0 bg-black/40 z-20" />
  </div>

  {/* Centered Content */}
  <div className="relative z-30 flex flex-col items-center justify-center h-full px-6 text-center">
    <motion.h1
      className="text-4xl md:text-6xl font-bold mb-6"
      initial={{ opacity: 0, y: -40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      About Kisite Canines
    </motion.h1>

    <motion.img
      src="/images/abouthero.png"
      alt="About Hero"
      className="w-40 md:w-56 h-auto mb-6"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      viewport={{ once: true }}
    />

    <motion.p
      className="text-lg md:text-xl max-w-3xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6 }}
      viewport={{ once: true }}
    >
      Welcome to Kisite Canines – your trusted partner in raising, training, and caring for dogs.
      We are a licensed dog kennel facility based in Community Road, Syokimau, Machakos County, Kenya,
      offering premium dog care services including boarding, grooming, training, and dog sales.
    </motion.p>
  </div>
</section>

       
{/* Story Section */}
<section
  className="about-story px-4 md:px-16 py-12 space-y-12 bg-[#303A40]"
  data-aos="fade-up"
>
  {/* Div 1: Heading & Intro Text */}
  <div
    className="space-y-6 max-w-4xl mx-auto text-center"
    data-aos="fade-up"
    data-aos-delay="100"
  >
    <h2 className="text-2xl md:text-3xl font-bold text-[#EAEAE6]">
      Our Story
    </h2>
    <p className="text-[#EAEAE6]">
      Kisite Canines began in 2020 in Syokimau, Machakos County, on the
      outskirts of Nairobi. It was born from the owner's deep love for dogs
      and a vision to provide a safe, healthy, and nurturing environment for
      them. Starting with just four beloved dogs — a German Shepherd,
      Rottweiler, Boerboel, and Cane Corso — Kisite Canines started as a
      humble, personal dog care service.
    </p>
  </div>

  {/* Div 2: Visual with Dogs */}
  <div
    className="relative w-full max-w-[700px] mx-auto h-[500px] md:h-[600px] rounded-md bg-white"
    data-aos="zoom-in"
    data-aos-delay="200"
  >
    {/* Dog images positioned absolutely */}
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
      <p className="text-xl font-medium md:text-sm text-center mt-2 text-gray-700">
        German Shepherd
      </p>
      <motion.img
        src="/images/germanshepherd.jpg"
        alt="German Shepherd"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="w-24 md:w-32 h-24 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
      />
    </div>

    <div className="absolute top-1/2 right-2 md:right-[20px] transform -translate-y-1/2">
      <motion.img
        src="/images/rottweiler.jpg"
        alt="Rottweiler"
        initial={{ x: 40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="w-24 md:w-32 h-24 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
      />
      <p className="text-xl font-medium md:text-sm text-center mt-2 text-gray-700">
        Rottweiler
      </p>
    </div>

    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <motion.img
        src="/images/boerboel.jpg"
        alt="Boerboel"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="w-24 md:w-32 h-24 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
      />
      <p className="text-xl font-medium md:text-sm text-center mt-2 text-gray-700">
        Boerboel
      </p>
    </div>

    <div className="absolute top-1/2 left-2 md:left-[20px] transform -translate-y-1/2">
      <motion.img
        src="/images/canecorso.jpg"
        alt="Cane Corso"
        initial={{ x: -40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="w-24 md:w-32 h-24 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
      />
      <p className="text-xl font-medium md:text-sm text-center mt-2 text-gray-700">
        Cane Corso
      </p>
    </div>

    {/* Center Title */}
   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#D7CD43] text-[#303A40] w-20 h-20 md:w-28 md:h-28 flex items-center justify-center rounded-full font-semibold shadow-inner z-10 text-sm md:text-base">
  Our Roots
</div>


    {/* SVG Arrows (only visible on md+) */}
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="9"
          markerHeight="6"
          refX="0"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#6B7280" />
        </marker>
      </defs>
      <line
        x1="350"
        y1="300"
        x2="350"
        y2="190"
        stroke="#6B7280"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <line
        x1="350"
        y1="300"
        x2="460"
        y2="300"
        stroke="#6B7280"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <line
        x1="350"
        y1="300"
        x2="350"
        y2="410"
        stroke="#6B7280"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <line
        x1="350"
        y1="300"
        x2="240"
        y2="300"
        stroke="#6B7280"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  </div>

  {/* Div 3: Final Paragraph */}
  <div
    className="max-w-4xl mx-auto text-center"
    data-aos="fade-up"
    data-aos-delay="300"
  >
    <p className="text-[#EAEAE6]">
      Over the years, through passion, dedication, and the trust of our
      growing community, we have evolved into a full-fledged professional
      kennel. We began by offering high-quality, responsibly bred puppies and
      gradually expanded our services to include expert training, professional
      grooming, and secure boarding for our esteemed and loyal customers.
    </p>
  </div>
</section>




        {/* Services Summary */}
<section
  className="about-services-summary px-6 md:px-16 py-16 bg-gray-50"
  data-aos="fade-up"
>
  {/* Centered Heading */}
  <h1
    className="about-services-title text-3xl font-bold text-center text-gray-800 mb-12"
    data-aos="fade-up"
    data-aos-delay="100"
  >
    What We Do
  </h1>

  {/* 2-Column Responsive Grid */}
  <div
    className="about-services-grid grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
    data-aos="fade-up"
    data-aos-delay="200"
  >
    {/* Card 1 */}
    <div
      className="about-service-card bg-white p-6 rounded-lg shadow-md text-center"
      data-aos="zoom-in"
      data-aos-delay="300"
    >
      <Link to="/boarding" className="flex flex-col items-center space-y-4">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="10" y="24" width="44" height="30" fill="#F2D7B6" stroke="#333" strokeWidth="2" />
          <path d="M10 24L32 8L54 24" fill="#E7B87A" stroke="#333" strokeWidth="2" />
          <rect x="26" y="40" width="12" height="14" fill="#fff" stroke="#333" strokeWidth="2" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700">Dog Boarding</h2>
      </Link>
      <p className="mt-4 text-gray-600">
        Safe, clean, and comfortable boarding facilities for your dog while you're away —
        ensuring peace of mind and a home-like experience.
      </p>
    </div>

    {/* Card 2 */}
    <div
      className="about-service-card bg-white p-6 rounded-lg shadow-md text-center"
      data-aos="zoom-in"
      data-aos-delay="400"
    >
      <Link to="/training" className="flex flex-col items-center space-y-4">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="20" cy="20" r="6" fill="#FEC260" stroke="#333" strokeWidth="2" />
          <circle cx="44" cy="20" r="6" fill="#FEC260" stroke="#333" strokeWidth="2" />
          <rect x="16" y="28" width="32" height="8" rx="4" fill="#E57F84" stroke="#333" strokeWidth="2" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700">Dog Training</h2>
      </Link>
      <p className="mt-4 text-gray-600">
        Personalized training programs to help shape confident, obedient, and well-behaved dogs guided by certified professionals.
      </p>
    </div>

    {/* Card 3 */}
    <div
      className="about-service-card bg-white p-6 rounded-lg shadow-md text-center"
      data-aos="zoom-in"
      data-aos-delay="500"
    >
      <Link to="/grooming" className="flex flex-col items-center space-y-4">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path d="M20 8L44 56" stroke="#333" strokeWidth="3" />
          <path d="M44 8L20 56" stroke="#333" strokeWidth="3" />
          <circle cx="20" cy="8" r="4" fill="#A1C6EA" stroke="#333" strokeWidth="2" />
          <circle cx="44" cy="8" r="4" fill="#A1C6EA" stroke="#333" strokeWidth="2" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700">Dog Grooming</h2>
      </Link>
      <p className="mt-4 text-gray-600">
        Comprehensive grooming services to keep your dog healthy, hygienic, and looking their absolute best — all breeds welcome.
      </p>
    </div>

    {/* Card 4 */}
    <div
      className="about-service-card bg-white p-6 rounded-lg shadow-md text-center"
      data-aos="zoom-in"
      data-aos-delay="600"
    >
      <Link to="/our-listings" className="flex flex-col items-center space-y-4">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" stroke="#333" strokeWidth="2" fill="#FFF0C1" />
          <path d="M24 36C24 30 40 30 40 36C40 40 32 44 32 44C32 44 24 40 24 36Z" fill="#F4A261" stroke="#333" strokeWidth="2" />
          <circle cx="26" cy="28" r="3" fill="#333" />
          <circle cx="38" cy="28" r="3" fill="#333" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700">Dog Sales</h2>
      </Link>
      <p className="mt-4 text-gray-600">
        Ethically bred, vaccinated, and well-socialized puppies, raised with love and ready to join caring forever homes.
      </p>
    </div>
  </div>
</section>


        {/* Mission & Values */}

<section
  className="about-mission-values px-6 md:px-16 py-16 bg-white text-center"
  data-aos="fade-up"
>
  {/* Heading */}
  <motion.h2
    initial={{ opacity: 0, y: -30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true }}
    className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
  >
    Our Mission & Values
  </motion.h2>

  {/* Paragraph */}
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.6 }}
    viewport={{ once: true }}
    className="max-w-3xl mx-auto text-gray-700 text-lg mb-12"
  >
    At Kisite Canines, our mission is to deliver compassionate, expert care that supports the well-being, development, and happiness of every dog.
    We strive to build lifelong relationships based on trust, professionalism, and love for animals.
    Guided by our core values, we ensure each dog and client receives the attention and respect they deserve.
  </motion.p>

  {/* Values Grid Container */}
  <div className="flex flex-col md:flex-row justify-center gap-12 text-left max-w-6xl mx-auto">
    
    {/* Group 1 */}
    <div className="flex flex-col gap-12 md:grid md:grid-cols-2 md:gap-y-16 md:gap-x-10">
      {/* Item 1 */}
      <motion.div
        className="relative md:-top-6"
        data-aos="fade-right"
        data-aos-delay="100"
      >
        <li className="list-none">
          <strong>🐾 Compassionate Care:</strong><br />
          <span className="text-gray-600">We treat every dog with love, empathy, and respect.</span>
        </li>
      </motion.div>

      {/* Item 2 */}
      <motion.div
        className="relative md:top-6"
        data-aos="fade-right"
        data-aos-delay="200"
      >
        <li className="list-none">
          <strong>🏡 Trust & Safety:</strong><br />
          <span className="text-gray-600">Our facility prioritizes cleanliness, comfort, and secure environments.</span>
        </li>
      </motion.div>
    </div>

    {/* Group 2 */}
    <div className="flex flex-col gap-12 md:grid md:grid-cols-2 md:gap-y-16 md:gap-x-10">
      {/* Item 3 */}
      <motion.div
        className="relative md:-top-6"
        data-aos="fade-left"
        data-aos-delay="300"
      >
        <li className="list-none">
          <strong>🎯 Professional Excellence:</strong><br />
          <span className="text-gray-600">Our team is trained, reliable, and committed to quality services.</span>
        </li>
      </motion.div>

      {/* Item 4 */}
      <motion.div
        className="relative md:top-6"
        data-aos="fade-left"
        data-aos-delay="400"
      >
        <li className="list-none">
          <strong>🌱 Lifelong Commitment:</strong><br />
          <span className="text-gray-600">We nurture long-term relationships with both dogs and their owners.</span>
        </li>
      </motion.div>
    </div>
  </div>
</section>

        {/* Staff Section */}
<section
  className="about-staff py-10 px-6 md:px-16 bg-[#EAEAE8]"
  data-aos="fade-up"
>
  <motion.h2
    className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    Meet Our Team
  </motion.h2>

  <div className="about-staff-grid space-y-16 bg-transparent mb-32 p-6 rounded-lg">
    {/* Founder */}
    <motion.div
      className="flex justify-center"
      data-aos="zoom-in"
      data-aos-delay="100"
    >
      <div className="text-center max-w-xs space-y-2">
        <img
          src="/images/potrait.jpg"
          alt="John Mwangi"
          className="w-40 h-40 object-cover rounded-full mx-auto border-4 border-blue-500 shadow-md"
        />
        <h4 className="text-xl font-semibold text-gray-800">John Mwangi</h4>
        <p className="text-gray-600">Founder & Kennel Director</p>
      </div>
    </motion.div>

    {/* Trainers & Groomers */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
      {/* Trainers */}
      <motion.div className="space-y-6" data-aos="fade-right" data-aos-delay="150">
        <h3 className="text-xl font-semibold text-gray-800 text-center">Trainers</h3>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {[["Peter Otieno", "Senior Dog Trainer"], ["Alice Mumo", "Behavior & Obedience Coach"]].map(
            ([name, role], index) => (
              <motion.div
                key={name}
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                viewport={{ once: true }}
              >
                <img
                  src="/images/potrait.jpg"
                  alt={name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border"
                />
                <h4 className="font-medium text-gray-800">{name}</h4>
                <p className="text-gray-600 text-sm">{role}</p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* Groomers */}
      <motion.div className="space-y-6" data-aos="fade-left" data-aos-delay="200">
        <h3 className="text-xl font-semibold text-gray-800 text-center">Groomers</h3>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {[["Sarah Wambui", "Lead Groomer"], ["Brian Kiprotich", "Pet Stylist"]].map(
            ([name, role], index) => (
              <motion.div
                key={name}
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                viewport={{ once: true }}
              >
                <img
                  src="/images/potrait.jpg"
                  alt={name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border"
                />
                <h4 className="font-medium text-gray-800">{name}</h4>
                <p className="text-gray-600 text-sm">{role}</p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    </div>

    {/* Kennel Manager */}
    <motion.div className="flex justify-center" data-aos="zoom-in" data-aos-delay="250">
      <div className="text-center max-w-xs space-y-2">
        <img
          src="/images/potrait.jpg"
          alt="Lucy Njeri"
          className="w-40 h-40 object-cover rounded-full mx-auto border-4 border-green-500 shadow-md"
        />
        <h4 className="text-xl font-semibold text-gray-800">Lucy Njeri</h4>
        <p className="text-gray-600">Kennel Manager</p>
      </div>
    </motion.div>

    {/* Veterinary + Care & Sales */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Support Team */}
      <motion.div className="space-y-6" data-aos="fade-right" data-aos-delay="300">
        <h3 className="text-xl font-semibold text-gray-800 text-center">Support Team</h3>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {[["Dr. Kevin Musyoka", "Veterinary Technician"], ["Nancy Oduor", "Client Relations Officer"]].map(
            ([name, role], index) => (
              <motion.div
                key={name}
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                viewport={{ once: true }}
              >
                <img
                  src="/images/potrait.jpg"
                  alt={name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border"
                />
                <h4 className="font-medium text-gray-800">{name}</h4>
                <p className="text-gray-600 text-sm">{role}</p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* Care & Sales */}
      <motion.div className="space-y-6" data-aos="fade-left" data-aos-delay="350">
        <h3 className="text-xl font-semibold text-gray-800 text-center">Care & Sales</h3>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {[["Faith Chege", "Puppy Care Specialist"], ["Martin Kamau", "Sales & Adoption Coordinator"]].map(
            ([name, role], index) => (
              <motion.div
                key={name}
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                viewport={{ once: true }}
              >
                <img
                  src="/images/potrait.jpg"
                  alt={name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border"
                />
                <h4 className="font-medium text-gray-800">{name}</h4>
                <p className="text-gray-600 text-sm">{role}</p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    </div>

    {/* Photographer */}
    <motion.div className="flex justify-center" data-aos="zoom-in" data-aos-delay="400">
      <div className="text-center max-w-xs space-y-2">
        <img
          src="/images/potrait.jpg"
          alt="Diana Mwikali"
          className="w-40 h-40 object-cover rounded-full mx-auto border-4 border-yellow-500 shadow-md"
        />
        <h4 className="text-xl font-semibold text-gray-800">Diana Mwikali</h4>
        <p className="text-gray-600">Photographer & Content Creator</p>
      </div>
    </motion.div>
  </div>
</section>

        {/* CTA */}
<section className="about-call-to-action relative bg-[#303A40] py-32 px-4 sm:px-8">
  {/* Floating Box (outer handles position, inner handles animation) */}
  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-full max-w-3xl z-10">
    <div
      data-aos="fade-up"
      className="bg-[#4F6866] p-8 rounded-xl shadow-2xl text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-[#EAEAE8] mb-4">
        Want to Know More?
      </h2>

      <p className="text-[#EAEAE8] text-lg mb-6">
        We’re happy to answer your questions or arrange a visit. Feel free to
        <Link to="/contact-us" className="inline-block ml-2">
          <button className="bg-[#D7CD43] text-[#303A40] px-6 py-2 rounded hover:bg-[#C5BC39] transition duration-300">
            Contact Us
          </button>
        </Link>{" "}
        anytime.
      </p>
    </div>
  </div>
</section>

      </div>
    </Layout>
  );
}; // <-- Close AboutHero component



export default About;
