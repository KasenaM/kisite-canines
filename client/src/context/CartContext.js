import React, { createContext, useContext, useState } from "react";


const CartContext = createContext();


export const useCart = () => useContext(CartContext);


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
