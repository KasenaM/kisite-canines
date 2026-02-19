import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";

function About() {
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev === 0 ? 1 : 0));
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>About Us - Kisite Canines</title>
        <meta name="description" content="Learn more about Kisite Canines, our story, and our dedicated team." />
      </Helmet>

      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero relative h-screen overflow-hidden text-white">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay loop muted
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                currentVideo === 0 ? "opacity-70 z-10" : "opacity-0 z-0"
              }`}
            >
              <source src="/images/aboutbgvd.mp4" type="video/mp4" />
            </video>
            <video
              autoPlay loop muted
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                currentVideo === 1 ? "opacity-70 z-10" : "opacity-0 z-0"
              }`}
            >
              <source src="/images/aboutbgvd2.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40 z-20" />
          </div>

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
              We are a licensed dog kennel facility based in Syokimau, Kenya.
            </motion.p>
          </div>
        </section>

        {/* ---  STORY SECTION --- */}
        <section className="about-story px-6 md:px-16 py-20 bg-[#303A40] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Part 1: The Beginning */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-[#D7CD43]">Our Story</h2>
                <div className="w-20 h-1 bg-[#D7CD43] rounded"></div>
                <p className="text-[#EAEAE6] text-lg leading-relaxed">
                  Kisite Canines began in 2020 in Syokimau, Machakos County. It was born from a deep love for dogs 
                  and a vision to provide a safe, healthy, and nurturing environment. Starting with just four 
                  beloved dogs, we began as a humble, personal dog care service.
                </p>
              </motion.div>

              {/* Dog Breed Collage Grid */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { name: "German Shepherd", src: "/images/germanshepherd.jpg" },
                  { name: "Rottweiler", src: "/images/rottweiler.jpg" },
                  { name: "Boerboel", src: "/images/boerboel.jpg" },
                  { name: "Cane Corso", src: "/images/canecorso.jpg" }
                ].map((dog, idx) => (
                  <div key={idx} className="group relative overflow-hidden rounded-xl shadow-xl aspect-square">
                    <img src={dog.src} alt={dog.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium text-sm">{dog.name}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Part 2: The Evolution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:order-2 space-y-6"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-[#EAEAE6]">Professional Evolution</h3>
                <p className="text-[#EAEAE6]/80 text-lg leading-relaxed">
                  Over the years, through passion and the trust of our growing community, we have evolved 
                  into a full-fledged professional kennel. What started with responsible breeding has 
                  expanded into expert training, professional grooming, and secure boarding for our 
                  loyal customers.
                </p>
                <div className="flex gap-4 pt-4">
                  <div className="bg-[#4F6866] p-4 rounded-lg flex-1 text-center">
                    <span className="block text-2xl font-bold text-[#D7CD43]">5+</span>
                    <span className="text-xs text-[#EAEAE6] uppercase tracking-wider">Years Experience</span>
                  </div>
                  <div className="bg-[#4F6866] p-4 rounded-lg flex-1 text-center">
                    <span className="block text-2xl font-bold text-[#D7CD43]">100%</span>
                    <span className="text-xs text-[#EAEAE6] uppercase tracking-wider">Passionate Care</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:order-1 relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-[#4F6866]/30">
                   <img src="/images/ourkennel.jpeg" alt="Our Kennel" className="w-full h-[400px] object-cover" />
                  
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        {/* --- END STORY SECTION --- */}

        {/* Services Summary Section */}
<section 
      className="about-services-summary relative px-6 md:px-16 py-24 bg-[#EAEAE8] overflow-hidden"     
      style={{
        clipPath: "ellipse(130% 100% at 50% 0%)",
        paddingBottom: "120px" 
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Centered Heading */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm font-bold tracking-widest text-[#4F6866] uppercase mb-3">Our Expertise</h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Professional Dog Services
          </h1>
          <div className="w-24 h-1.5 bg-[#D7CD43] mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Card 1: Boarding */}
          <motion.div 
            className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 flex flex-col justify-between"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#D7CD43] rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <div>
              <div className="w-16 h-16 bg-[#F2D7B6]/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                <svg width="40" height="40" viewBox="0 0 64 64" fill="none" className="drop-shadow-sm">
                  <rect x="10" y="24" width="44" height="30" rx="2" fill="#F2D7B6" stroke="#333" strokeWidth="2.5" />
                  <path d="M10 24L32 8L54 24" fill="#E7B87A" stroke="#333" strokeWidth="2.5" />
                  <rect x="26" y="40" width="12" height="14" fill="#fff" stroke="#333" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Dog Boarding</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Safe, clean, and comfortable facilities ensuring a stress-free, home-like experience for your dog.
              </p>
            </div>
            <Link to="/boarding" className="text-[#4F6866] font-bold inline-flex items-center group/link">
              Explore Service 
              <span className="ml-2 transform group-hover/link:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </motion.div>

          {/* Card 2: Training */}
          <motion.div 
            className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 flex flex-col justify-between"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#4F6866] rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <div>
              <div className="w-16 h-16 bg-[#FEC260]/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
                  <circle cx="20" cy="20" r="6" fill="#FEC260" stroke="#333" strokeWidth="2.5" />
                  <circle cx="44" cy="20" r="6" fill="#FEC260" stroke="#333" strokeWidth="2.5" />
                  <rect x="16" y="28" width="32" height="8" rx="4" fill="#E57F84" stroke="#333" strokeWidth="2.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Expert Training</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Personalized obedience programs designed to shape confident, well-behaved canine companions.
              </p>
            </div>
            <Link to="/training" className="text-[#4F6866] font-bold inline-flex items-center group/link">
              Explore Service 
              <span className="ml-2 transform group-hover/link:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </motion.div>

          {/* Card 3: Grooming */}
          <motion.div 
            className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 flex flex-col justify-between"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#D7CD43] rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <div>
              <div className="w-16 h-16 bg-[#A1C6EA]/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
                  <path d="M20 8L44 56" stroke="#333" strokeWidth="3" />
                  <path d="M44 8L20 56" stroke="#333" strokeWidth="3" />
                  <circle cx="20" cy="8" r="4" fill="#A1C6EA" stroke="#333" strokeWidth="2.5" />
                  <circle cx="44" cy="8" r="4" fill="#A1C6EA" stroke="#333" strokeWidth="2.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Dog Grooming</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Full-service hygienic grooming to keep your dog healthy and looking their absolute best.
              </p>
            </div>
            <Link to="/grooming" className="text-[#4F6866] font-bold inline-flex items-center group/link">
              Explore Service 
              <span className="ml-2 transform group-hover/link:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </motion.div>

          {/* Card 4: Sales */}
          <motion.div 
            className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 flex flex-col justify-between"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#4F6866] rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <div>
              <div className="w-16 h-16 bg-[#FFF0C1]/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" stroke="#333" strokeWidth="2.5" fill="#FFF0C1" />
                  <path d="M24 36C24 30 40 30 40 36C40 40 32 44 32 44C32 44 24 40 24 36Z" fill="#F4A261" stroke="#333" strokeWidth="2.5" />
                  <circle cx="26" cy="28" r="3" fill="#333" />
                  <circle cx="38" cy="28" r="3" fill="#333" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Puppy Sales</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Ethically bred, well-socialized puppies raised with love and ready for forever homes.
              </p>
            </div>
            <Link to="/our-listings" className="text-[#4F6866] font-bold inline-flex items-center group/link">
              Explore Service 
              <span className="ml-2 transform group-hover/link:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>

        {/* Mission & Values */}
<section className="about-mission-values px-6 md:px-16 py-24 bg-white text-center overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-extrabold text-[#303A40] mb-8"
        >
          Our Mission & Values
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-[#4F6866] text-lg mb-20 leading-relaxed"
        >
          At Kisite Canines, our mission is to deliver compassionate, expert care that supports the well-being, 
          development, and happiness of every dog. Guided by our core values, we ensure each dog 
          and client receives the attention and respect they deserve.
        </motion.p>

        {/* Values Wave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-start max-w-6xl mx-auto">
          
          {/* Step 1: DOWN */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 60 }} // Maintains the "Down" position in view
            whileHover={{ y: 50, scale: 1.02, transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="group bg-gray-50 p-8 rounded-2xl border-b-4 border-[#D7CD43] hover:border-[#4F6866] shadow-sm lg:translate-y-12 text-left transition-colors duration-300"
          >
            <div className="text-4xl mb-4 filter grayscale group-hover:grayscale-0 transition-all">🐾</div>
            <h4 className="text-xl font-bold text-[#303A40] mb-2">Compassionate Care</h4>
            <p className="text-[#4F6866] text-sm leading-relaxed">
              We treat every dog with love, empathy, and respect as if they were our own.
            </p>
          </motion.div>

          {/* Step 2: UP */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }} // Maintains the "Up" position in view
            whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="group bg-gray-50 p-8 rounded-2xl border-b-4 border-[#4F6866] hover:border-[#D7CD43] shadow-sm lg:-translate-y-6 text-left transition-colors duration-300"
          >
            <div className="text-4xl mb-4 filter grayscale group-hover:grayscale-0 transition-all">🏡</div>
            <h4 className="text-xl font-bold text-[#303A40] mb-2">Trust & Safety</h4>
            <p className="text-[#4F6866] text-sm leading-relaxed">
              Our facility prioritizes cleanliness, comfort, and secure environments for all.
            </p>
          </motion.div>

          {/* Step 3: DOWN */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 60 }}
            whileHover={{ y: 50, scale: 1.02, transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="group bg-gray-50 p-8 rounded-2xl border-b-4 border-[#D7CD43] hover:border-[#4F6866] shadow-sm lg:translate-y-12 text-left transition-colors duration-300"
          >
            <div className="text-4xl mb-4 filter grayscale group-hover:grayscale-0 transition-all">🎯</div>
            <h4 className="text-xl font-bold text-[#303A40] mb-2">Professional Excellence</h4>
            <p className="text-[#4F6866] text-sm leading-relaxed">
              Our team is highly trained, reliable, and committed to providing quality services.
            </p>
          </motion.div>

          {/* Step 4: UP */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="group bg-gray-50 p-8 rounded-2xl border-b-4 border-[#4F6866] hover:border-[#D7CD43] shadow-sm lg:-translate-y-6 text-left transition-colors duration-300"
          >
            <div className="text-4xl mb-4 filter grayscale group-hover:grayscale-0 transition-all">🌱</div>
            <h4 className="text-xl font-bold text-[#303A40] mb-2">Lifelong Commitment</h4>
            <p className="text-[#4F6866] text-sm leading-relaxed">
              We nurture long-term relationships with both dogs and their dedicated owners.
            </p>
          </motion.div>

        </div>
      </div>
    </section>


        {/* Staff Section */}
      <section className="about-staff py-24 px-6 md:px-16 bg-gradient-to-b from-[#303A40] 10% via-[#EAEAE8] to-white overflow-hidden"
                  style={{
  
  clipPath: "ellipse(130% 100% at 50% 100%)",
  paddingTop: "100px", 
  marginTop: "20px"  
}}>
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <motion.div 
      className="text-center mb-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl md:text-5xl font-black text-[#D7CD43] mb-4">Meet Our Team</h2>
      <div className="w-20 h-1 bg-[#303A40] mx-auto my-6"></div>
      <p className="text-white max-w-2xl mx-auto font-medium">
        The passionate experts behind Kisite Canines, dedicated to providing the highest standard of care for your furry companions.
      </p>
      
    </motion.div>

    {/* The Bento Grid Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Hero: Founder (Large Card) */}
      <motion.div 
        className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border-t-8 border-[#D7CD43] group"
        whileHover={{ y: -10 }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="relative mb-6">
          <img 
            src="/images/potrait.jpg" 
            alt="John Mwangi" 
            className="w-48 h-48 object-cover rounded-2xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500" 
          />
          <div className="absolute -bottom-2 -right-2 bg-[#303A40] text-white p-2 rounded-lg text-xs font-bold uppercase tracking-widest">
            Founder
          </div>
        </div>
        <h4 className="text-2xl font-bold text-[#303A40]">John Mwangi</h4>
        <p className="text-[#4F6866] font-semibold">Kennel Director</p>
        <p className="mt-4 text-sm text-gray-500 italic">"Leading with love for every breed."</p>
      </motion.div>

      {/* Department: Trainers & Groomers */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trainers Block */}
        <motion.div 
          className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm"
          whileInView={{ opacity: 1, x: 0 }} 
          initial={{ opacity: 0, x: 20 }}
          viewport={{ once: true }}
        >
          <h3 className="text-sm font-black uppercase tracking-tighter text-[#4F6866] mb-6 border-b pb-2">Training Department</h3>
          <div className="space-y-6">
            {[["Peter Otieno", "Senior Dog Trainer"], ["Alice Mumo", "Behavior Coach"]].map(([name, role]) => (
              <div key={name} className="flex items-center gap-4 group">
                <img src="/images/potrait.jpg" alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-[#D7CD43] group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-[#303A40] leading-none">{name}</h4>
                  <p className="text-xs text-[#4F6866] mt-1">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Groomers Block */}
        <motion.div 
          className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm"
          whileInView={{ opacity: 1, x: 0 }} 
          initial={{ opacity: 0, x: 20 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-black uppercase tracking-tighter text-[#4F6866] mb-6 border-b pb-2">Grooming Studio</h3>
          <div className="space-y-6">
            {[["Sarah Wambui", "Lead Groomer"], ["Brian Kiprotich", "Pet Stylist"]].map(([name, role]) => (
              <div key={name} className="flex items-center gap-4 group">
                <img src="/images/potrait.jpg" alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-[#4F6866] group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-[#303A40] leading-none">{name}</h4>
                  <p className="text-xs text-[#4F6866] mt-1">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2: Manager & Support (Transitioning to dark theme) */}
      <motion.div 
        className="lg:col-span-3 bg-[#4F6866]  p-8 rounded-3xl shadow-xl flex flex-col items-center text-center text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
      >
        <img src="/images/potrait.jpg" alt="Lucy Njeri" className="w-24 h-24 object-cover rounded-full mb-4 grayscale hover:grayscale-0 transition-all duration-300" />
        <h4 className="text-lg font-bold">Lucy Njeri</h4>
        <p className="text-white/70 text-xs">Kennel Manager</p>
      </motion.div>

      <div className="lg:col-span-6 bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/10 flex flex-wrap justify-around items-center">
         {[["Dr. Kevin Musyoka", "Vet Tech"], ["Nancy Oduor", "Relations"]].map(([name, role]) => (
            <div key={name} className="text-center p-4">
              <img src="/images/potrait.jpg" alt={name} className="w-20 h-20 rounded-full mx-auto mb-2 border-2 border-white/20" />
              <h4 className="text-[#303A40] font-bold text-sm">{name}</h4>
              <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">{role}</p>
            </div>
         ))}
      </div>

      <motion.div 
        className="lg:col-span-3 bg-[#303A40] p-8 rounded-3xl shadow-xl flex flex-col items-center text-center text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
      >
        <img 
          src="/images/potrait.jpg" 
          alt="Diana Mwikali" 
          className=" w-32 h-32 object-cover rounded-full mb-4 border-4 border-[#D7CD43]" 
        />
        <h4 className="text-xl font-bold">Diana Mwikali</h4>
        <p className=" text-[#D7CD43] text-sm font-medium">Content Creator</p>
      </motion.div>

    </div>
  </div>
</section>

        {/* CTA */}
      <section className="about-call-to-action relative bg-[#303A40] py-32 px-4 sm:px-8">
  {/* Floating Box */}
  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-[#4F6866] p-8 md:p-12 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center"
    >
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#EAEAE8] mb-6 max-w-2xl leading-tight">
        Want to Know More?
      </h2>

      {/* Paragraph & Button */}
      <div className="max-w-xl flex flex-col items-center">
        <p className="text-[#EAEAE8] text-base md:text-lg mb-8 leading-relaxed">
          We’re happy to answer your questions or arrange a visit. Feel free to 
          <span className="block sm:inline sm:ml-2 mt-4 sm:mt-0">
            <Link to="/contact-us">
              <button className="bg-[#D7CD43] text-[#303A40] px-8 py-3 rounded-full font-bold hover:bg-[#C5BC39] transition-all duration-300 transform hover:scale-105 shadow-lg">
                Contact Us
              </button>
            </Link>
          </span>
          {" "}anytime.
        </p>
      </div>
    </motion.div>
  </div>
</section>


      </div>
    </>
  );
}

export default About;