// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Training from "./pages/Training";
import Grooming from "./pages/Grooming";
import Boarding from "./pages/Boarding";
import OurListings from "./pages/OurListings";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import ShoppingCart from "./pages/ShoppingCart";
import CheckoutForm from './components/CheckoutForm';
import ScrollToTop from "./components/ScrollToTop";
import ServiceBooking from "./pages/ServiceBooking";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar /> {/* ✅ now has access to AuthContext */}
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/training" element={<Training />} />
          <Route path="/grooming" element={<Grooming />} />
          <Route path="/boarding" element={<Boarding />} />
          <Route path="/our-listings" element={<OurListings />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/book-service" element={<ServiceBooking />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
