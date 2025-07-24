import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import dogListings from '../data/dogListings';
import { useAuth } from '../context/AuthContext';
import LoginPromptModal from '../components/LoginPromptModal';
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
      { threshold: 0.01 }
    );
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

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
    <Layout>
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

      <div className="dog-shop-container">
        {/* Hero Section */}
        <section ref={heroRef} className="text-center py-20 bg-[#EAEAE8]">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#303A40] mb-4">
              Welcome to Our Dog Shop
            </h1>
            <p className="text-lg text-[#4F6866]">
              Browse our available puppies by breed and find your perfect companion!
            </p>
          </div>
        </section>

        {/* Sticky Breed Navigation */}
        <section className={` mt-2 transition-all duration-200 ${isNavFixed ? 'fixed top-[64px] left-0 w-full z-40 bg-white shadow-md' : 'relative'}`}>
          <nav className="py-2 px-4">
            <ul className="flex space-x-4 justify-center  flex-wrap text-[#D7CD43] font-medium">
              {breeds.map((breed) => (
                <li key={breed}>
                  <a
                    href={`#${breed.replace(/\s/g, '-').toLowerCase()}`}
                    className="hover:underline hover:text-[#303A40] transition"
                  >
                    {breed}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {/* Spacer */}
        <div className="h-[70px]" />

        {/* Breed Sections */}
        {breeds.map((breed) => (
          <section
            key={breed}
            id={breed.replace(/\s/g, '-').toLowerCase()}
            className="py-10 scroll-mt-[130px] px-4 md:px-12 bg-[#F8F8F6]"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-center text-[#303A40] mb-8">
              {breed} Puppies
            </h2>

            <div className="max-w-screen-xl mx-auto">
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {dogListings.filter((dog) => dog.breed === breed).length === 0 ? (
                  <p className="col-span-full text-center text-[#9BAFAF]">
                    No {breed} puppies available at the moment.
                  </p>
                ) : (
                  dogListings
                    .filter((dog) => dog.breed === breed)
                    .map((dog) => (
                      <div
                        key={dog.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden relative"
                      >
                        <img
                          src={dog.imageUrl}
                          alt={`${breed} puppy`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3 space-y-1 text-sm">
                          <p><strong>Age:</strong> {dog.age}</p>
                          <p><strong>Gender:</strong> {dog.gender}</p>
                          <p><strong>Price:</strong>{' '}
                            <span className="text-green-600 font-semibold">
                              KES {dog.price.toLocaleString()}
                            </span>
                          </p>

                          <div className="flex justify-between items-center mt-3 gap-2">
                            <button
                              onClick={() => handleBuyNow(dog)}
                              className="flex-1 bg-[#D7CD43] text-[#303A40] py-1 text-xs rounded hover:bg-[#C5BC39] transition"
                            >
                              Purchase
                            </button>

                            <button
                              onClick={() => handleAddToCart(dog)}
                              className="p-2 text-[#D7CD43] border border-[#D7CD43] rounded hover:bg-[#D7CD43] hover:text-[#303A40] transition"
                              aria-label="Add to cart"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                   viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7H19a1 1 0 001-1v-1H7m0 0H4M16 21a1 1 0 11-2 0 1 1 0 012 0zm-8 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Added to Cart Popup */}
                        {showAddedPopupId === dog.id && (
                          <div className="absolute top-2 right-2 bg-[#D7CD43] text-[#303A40] text-xs px-2 py-1 rounded shadow">
                            Added to cart
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
}

export default OurListings;
