import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";



function Home() {
  return (
    <>
      <main className="home-container">
        <Helmet>
          <title>Kisite Canines | Dog Training, Grooming & Boarding in Kenya</title>
          <meta name="description" content="Welcome to Kisite Canines, your trusted partner in dog care." />
        </Helmet>

        {/* Hero Section */}
        <section
  className="w-full h-[48vh] sm:h-screen bg-center bg-no-repeat relative flex items-center justify-center"
  style={{
    backgroundImage: "url('/images/homebg5.jpg')",
    backgroundSize: window.innerWidth < 640 ? '100% 100%' : 'cover',
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-[#303A40]/40 z-0"></div>

  {/* Text Content */}
  <div
    className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12"
    data-aos="fade-up"
    data-aos-delay="100"
    data-aos-duration="1000"
  >
    <div className="text-white md:max-w-xl space-y-6">
      <h1
        className="text-4xl md:text-6xl font-bold leading-tight mb-20"
        data-aos="fade-right"
        data-aos-delay="300"
      >
        Welcome to Kisite Canines
      </h1>

      <div
        className="flex gap-4 mt-4 flex-wrap"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <p className="text-lg md:text-2xl">
          Trusted care, loyal companions – where dogs thrive.
        </p>

        <Link to="/our-listings">
          <button className="px-6 py-3 bg-[#D7CD43] text-[#303A40] rounded hover:bg-[#C5BC39] transition text-lg font-semibold">
            View Dogs
          </button>
        </Link>

        <Link to="/contact-us">
          <button className="px-6 py-3 border border-white text-white rounded hover:bg-white hover:text-[#303A40] transition text-lg font-semibold">
            Get In Touch
          </button>
        </Link>
      </div>
    </div>
  </div>
</section>


        {/* About Preview */}
        <section className="about-preview py-16 px-6 bg-[#EAEAE8] flex justify-center items-center">
  <div className="flex items-center justify-center gap-12 max-w-6xl w-full flex-col md:flex-row mb-12 mt-12">
    
    {/* Image with stacked background */}
    <div
      className="relative w-72 h-80 flex-shrink-0"
      data-aos="fade-right"
      data-aos-duration="1000"
    >
      <div className="absolute -left-6 top-8 w-72 h-80 bg-[#4F6866] rounded-lg z-0" />
      <img
        src="/images/aboutpr.jpg"
        alt="Preview Dog"
        className="relative z-10 w-full h-full object-cover rounded-lg shadow-lg"
      />
    </div>

    {/* Text Content */}
    <div
      className="text-center md:text-left max-w-md space-y-6 w-full"
      data-aos="fade-left"
      data-aos-delay="300"
      data-aos-duration="1000"
    >
      <p className="text-lg text-[#303A40]">
        We are a professional dog kennel based in Kenya, offering expert dog care,
        training, grooming, and quality dogs for sale. At Kisite Canines, every dog is family.
      </p>
      <div className="flex justify-center md:justify-start">
        <Link to="/about-us">
          <button className="px-6 py-2 bg-[#D7CD43] text-[#303A40] rounded hover:bg-[#C5BC49] transition font-medium">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  </div>
</section>


        {/* Services Preview */}
      <section className="services-preview text-center px-4 py-16 bg-[#303A40]">
  <h2 className="text-5xl font-semibold mb-10 text-[#EAEAE6]">Our Services</h2>

  <div className="service-cards flex flex-wrap justify-center gap-14 mb-10">
    {[
      {
        img: '/images/training.jpg',
        title: 'Training',
        text: 'Professional dog training services to ensure your dog is well-behaved and happy.',
        href: '/training',
      },
      {
        img: '/images/grooming.jpg',
        title: 'Grooming',
        text: 'Expert grooming services to keep your dog looking and feeling their best.',
        href: '/grooming',
      },
      {
        img: '/images/boarding.jpg',
        title: 'Boarding',
        text: 'Safe and comfortable boarding facilities for your dog while you’re away.',
        href: '/boarding',
      },
    ].map((card, i) => (
      <motion.div
        key={i}
        className="w-72 bg-white rounded-lg shadow-md p-6 cursor-pointer"
        whileHover={{ scale: 1.05, rotate: 1 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.2, duration: 0.6 }}
        data-aos="fade-up"
        data-aos-delay={i * 100}
        data-aos-duration="800"
      >
        <img
          src={card.img}
          alt={card.title}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
        <h3 className="text-xl font-medium text-[#303A40] mb-2">
          {card.title}
        </h3>
        <p className="text-[#4F6866] mb-4">{card.text}</p>
        <a href={card.href}>
          <button className="px-4 py-2 bg-[#D7CD43] text-[#303A40] rounded hover:bg-[#C5BC39] transition font-medium">
            Learn More
          </button>
        </a>
      </motion.div>
    ))}
  </div>
</section>


        {/* Parallax Reveal Section */}
        <section className="hidden sm:block relative h-[100vh] overflow-hidden">
          <div className="sticky top-0 h-full z-0 px-6">
            <div
              className="w-full h-full bg-center bg-no-repeat bg-fixed bg-cover"
              style={{ backgroundImage: "url('/images/services-bridge.jpg')" }}
            ></div>
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white via-transparent to-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
          </div>
        </section>

        {/* Why Choose Us */}
 <section className="why-choose-us bg-[#4F6866] px-6 py-16">
  <div className="max-w-6xl mx-auto mb-14 mt-12">
    <div className="mb-12">
      <h2 className="text-4xl font-bold text-left mb-2 text-[#EAEAE6]">Why Choose Us?</h2>
      <p className="text-[#EAEAE6] text-left max-w-md">
        At Kisite Canines, we prioritize the well-being of your dogs. Here's why we're the best choice:
      </p>
    </div>

    <div className="flex flex-col md:flex-row justify-between items-start gap-10">
      {[
        {
          num: 1,
          title: "Experienced and Caring Staff",
          desc: "Our team consists of professional handlers and trainers who are passionate about dog welfare and behavior."
        },
        {
          num: 2,
          title: "Safe and Clean Facilities",
          desc: "We maintain a hygienic and secure environment, ensuring every dog stays in comfort and health."
        },
        {
          num: 3,
          title: "Personalized Attention",
          desc: "Each dog receives customized care and interaction tailored to their breed, age, and personality."
        }
      ].map((step, i) => {
        return (
          <div
            key={i}
            className={`flex flex-col items-center text-center w-full md:w-1/3 ${
              i === 0
                ? 'md:translate-y-8'
                : i === 1
                ? 'md:-translate-y-12'
                : 'md:-translate-y-32'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-[#D7CD43] text-[#EAEAE6] flex items-center justify-center text-lg font-bold mb-4">
              {step.num}
            </div>
            <h3 className="text-lg font-semibold text-[#EAEAE6] mb-2">{step.title}</h3>
            <p className="text-sm text-[#EAEAE6] px-2">{step.desc}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>

        

        {/* Testimonials */}
        <section className="testimonials px-4 py-16 bg-[#F0F0ED]">
  <div className="flex flex-col lg:flex-row items-start gap-6 mb-4 mt-4">
    <div
      className="w-full lg:w-1/2 h-96 flex items-center justify-center"
      data-aos="fade-right"
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#303A40] mb-6">What Our Clients Say</h2>
        <p className="text-lg text-[#303A40]">
          Hear directly from our happy clients whose furry friends have thrived with us.
        </p>
      </div>
    </div>

    <div
      className="w-full lg:w-1/2 h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#9BAFAF] scrollbar-track-[#EAEAE8] hover:scrollbar-thumb-[#4F6866]"
      data-aos="fade-left"
    >
      <div className="flex flex-col gap-4">
        {[
          { text: "Kisite Canines took amazing care of my dog while I was on vacation. Highly recommend!", author: "Jane Doe" },
          { text: "The training services transformed my dog's behavior. Thank you, Kisite Canines!", author: "John Smith" },
          { text: "Very professional and friendly team. My dog loves going back.", author: "Alice Wanjiku" },
          { text: "The grooming services are top-notch. My poodle looked stunning!", author: "Brian Otieno" },
          { text: "Secure boarding and constant updates gave me peace of mind.", author: "Nancy Muthoni" },
          { text: "Kisite helped my puppy socialize confidently. Great trainers!", author: "George Mwangi" },
          { text: "Fast response and helpful support, even after service.", author: "Esther Njoki" },
          { text: "I adopted the perfect companion here. Thank you!", author: "Paul Kipkoech" },
        ].map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <p className="text-[#CFBE3A] italic">"{testimonial.text}"</p>
            <h4 className="text-sm text-[#CFBE3A] mt-2">- {testimonial.author}</h4>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


      </main>
    </>
  );
}

export default Home;
