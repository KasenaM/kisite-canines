import React, { createContext, useContext, useState } from "react";

// 1. Create the context
const CartContext = createContext();

// 2. Custom hook to access the context
export const useCart = () => useContext(CartContext);

// 3. Provider component to wrap your app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (dog) => {
    if (!cart.some(item => item.id === dog.id)) {
      setCart([...cart, dog]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((dog) => dog.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
