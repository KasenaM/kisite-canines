import React ,{ useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Layout from "../components/Layout";
import { useAuth } from '../context/AuthContext';
import LoginPromptModal from '../components/LoginPromptModal';
import { Helmet } from 'react-helmet-async';

function ShoppingCart() {
   const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const navigate = useNavigate(); 
  const { cart, removeFromCart } = useCart();

  const handleDelete = (id) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    navigate("/checkout");
  };

  return (
    <Layout>
<LoginPromptModal
        visible={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        message="Please log in or sign up to proceed with purchase."
      />

      <Helmet>
        <title>Shopping Cart - Kisite Canines</title>
        <meta name="description" content="Review your selected dogs and proceed to checkout at Kisite Canines." />
      </Helmet>

      <div className="cart-container max-w-5xl mx-auto py-16 px-4 md:px-8 bg-[#EAEAE8] min-h-[80vh]">
        <h2 className="text-3xl font-bold mb-8 text-[#303A40] text-center mt-6">
          Shopping Cart
        </h2>

        {cart.length === 0 ? (
          <div className="empty-cart text-center">
            <p className="text-[#4F6866] mb-4">Your cart is currently empty.</p>
            <button
              onClick={() => navigate("/our-listings")}
              className="bg-[#D7CD43] text-[#303A40] px-6 py-3 rounded hover:bg-[#C5BC39] transition font-semibold"
            >
              Go Back to Shop
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map((dog) => (
                <div
                  key={dog.id}
                  className="cart-dog flex flex-col md:flex-row items-center justify-between gap-6 bg-white shadow-md rounded p-6"
                >
                  <img
                    src={dog.imageUrl}
                    alt={dog.breed}
                    className="w-full md:w-40 h-40 object-cover rounded"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-lg font-semibold text-[#303A40]">
                      {dog.breed}
                    </p>
                    <p className="text-[#4F6866]">Age: {dog.age}</p>
                    <p className="text-[#4F6866]">Gender: {dog.gender}</p>
                    <p className="text-green-700 font-medium">
                      Price: KES {dog.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-4 md:mt-0">
                    {/* Add More */}
                    <button
                      onClick={() => navigate("/our-listings")}
                      className="bg-gray-100 p-2 rounded hover:bg-gray-200 transition"
                      aria-label="Add More Dogs"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(dog.id)}
                      className="bg-red-100 p-2 rounded hover:bg-red-200 transition"
                      aria-label="Remove"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Button */}
            <div className="cart-actions mt-10 text-center">
              <button
                className="bg-[#D7CD43] text-[#303A40] px-8 py-3 rounded shadow hover:bg-[#C5BC39] transition font-semibold"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default ShoppingCart;
