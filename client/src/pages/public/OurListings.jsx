import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import dogListings from '../../data/dogListings';
import { useAuth } from '../../context/AuthContext';
import LoginPromptModal from '../../components/common/LoginPromptModal';
import { Helmet } from 'react-helmet-async';

function OurListings() {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingDog, setPendingDog] = useState(null);
  const [showAddedPopupId, setShowAddedPopupId] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const breeds = ['German Shepherd', 'Rottweiler', 'Boerboel', 'Cane Corso'];
  const [isNavFixed, setIsNavFixed] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const target = heroRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setIsNavFixed(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

 
  const handleBreedClick = (e, breed) => {
    e.preventDefault();

    const sectionId = breed.replace(/\s/g, '-').toLowerCase();
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleBuyNow = (dog) => {
    if (!user) {
      setPendingDog(dog);
      setShowLoginPrompt(true);
      return;
    }
    navigate("/checkout", { state: { selectedDog: dog } });
  };

  const handleLoginAccepted = () => {
    setShowLoginPrompt(false);
    if (pendingDog) {
      navigate("/checkout", { state: { selectedDog: pendingDog } });
    }
  };

  const handleAddToCart = (dog) => {
    addToCart(dog);
    setShowAddedPopupId(dog.id);
    setTimeout(() => setShowAddedPopupId(null), 2000);
  };

  return (
    <>
      <LoginPromptModal
        visible={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onConfirm={handleLoginAccepted}
        message="Please log in or sign up to proceed with purchase."
      />

      <Helmet>
        <title>Our Listings - Kisite Canines</title>
        <meta name="description" content="Browse our available dog listings at Kisite Canines." />
      </Helmet>

      <div className="bg-[#FDFDFB] min-h-screen pb-20">
        
        {/* Hero Section */}
        <section 
          ref={heroRef} 
          className="relative pt-24 pb-32 text-center bg-[#303A40] overflow-hidden"
          style={{ clipPath: "ellipse(150% 100% at 50% 0%)" }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="grid grid-cols-6 gap-4 transform -rotate-12 translate-y-20">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-40 border border-white rounded-xl"></div>
                ))}
             </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-4xl mx-auto px-6"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-[#D7CD43] text-[#303A40] rounded-full">
              Puppy Boutique
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[#EAEAE8] mb-6 leading-tight">
              Find Your New <br/> 
              <span className="text-[#D7CD43]">Best Friend</span>
            </h1>
            <p className="text-lg md:text-xl text-[#9BAFAF] max-w-2xl mx-auto font-medium">
              Ethically raised, health-cleared, and ready for their forever homes. 
            </p>
          </motion.div>
        </section>

        {/* Sticky Breed Navigation */}
        <section className={`transition-all duration-300 z-40 px-0 ${isNavFixed ? 'fixed top-[50px] left-0 w-full z-40 px-0 py-3' : 'relative -mt-8 px-4'}`}>
          <div className={`mx-auto px-2 py-2 rounded-full transition-all duration-300 overflow-x-auto max-w-[calc(100vw-2rem)] ${isNavFixed ? 'bg-transparent ' : 'bg-white shadow-lg border border-gray-100'}`}>
            <ul className="flex items-center justify-center space-x-1 sm:space-x-4 px-0">
              {breeds.map((breed) => (
                <li key={breed}>
                  <a
                    href={`#${breed.replace(/\s/g, '-').toLowerCase()}`}
                    onClick={(e) => handleBreedClick(e, breed)}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                        isNavFixed ? 'text-[#D7CD43] hover:bg-[#D7CD43] hover:text-[#303A40]' : 'text-[#303A40] hover:bg-[#4F6866] hover:text-white'
                    }`}
                  >
                    {breed}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 mt-16 space-y-24">
          {breeds.map((breed) => {
            const availableDogs = dogListings.filter((dog) => dog.breed === breed);

            return (
              <section
                key={breed}
                id={breed.replace(/\s/g, '-').toLowerCase()}
                className="scroll-mt-[150px]"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b-2 border-gray-100 pb-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-[#303A40]">
                      {breed}s
                    </h2>
                    <p className="text-[#4F6866] font-medium mt-1">Available Champions</p>
                  </div>
                  <span className="mt-4 md:mt-0 px-3 py-1 bg-[#EAEAE8] text-[#303A40] text-sm font-bold rounded-lg">
                    {availableDogs.length} Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {availableDogs.length === 0 ? (
                    <div className="col-span-full py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                      <p className="text-[#9BAFAF] font-medium">
                        Our current {breed} litter is fully adopted. <br/> Check back soon!
                      </p>
                    </div>
                  ) : (
                    availableDogs.map((dog) => (
                      <motion.div
                        key={dog.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden"
                      >
                        <div className="relative h-64 overflow-hidden rounded-[1.5rem] mb-6">
                          <img
                            src={dog.imageUrl}
                            alt={`${breed} puppy`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-[#303A40]/80 backdrop-blur-sm text-[#D7CD43] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                              {dog.gender}
                            </span>
                          </div>
                        </div>

                        <div className="px-2 pb-2">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-black text-[#303A40] leading-tight capitalize">
                                {dog.age} Old
                              </h4>
                              <p className="text-[#4F6866] text-xs font-bold uppercase tracking-tighter">
                                Healthy & Socialized
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400 font-bold">PRICE</p>
                              <p className="text-lg font-black text-[#4F6866]">
                                KES {dog.price.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => handleBuyNow(dog)}
                              className="flex-[3] bg-[#4F6866] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#303A40] transition-all active:scale-95 shadow-lg shadow-black/10"
                            >
                              Adopt Now
                            </button>

                            <button
                              onClick={() => handleAddToCart(dog)}
                              className="flex-1 bg-[#EAEAE8] text-[#303A40] py-3 rounded-2xl flex justify-center items-center hover:bg-[#D7CD43] transition-all active:scale-95"
                              aria-label="Add to cart"
                            >
                              🛒
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {showAddedPopupId === dog.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute inset-0 z-20 bg-[#D7CD43]/90 backdrop-blur-sm flex items-center justify-center rounded-[2rem]"
                            >
                              <div className="text-center">
                                <div className="bg-white p-3 rounded-full inline-block mb-2 shadow-lg">
                                  ✓
                                </div>
                                <p className="text-[#303A40] font-black uppercase text-xs tracking-widest">
                                  Added to Cart
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </motion.div>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </>
  );
}

export default OurListings;
