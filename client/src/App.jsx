// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth
import { AuthProvider } from "./context/AuthContext";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import ClientLayout from "./layouts/ClientLayout";

// Protected Routes wrapper
import ProtectedRoutes from "./components/common/ProtectedRoutes";

// ===================== Public Pages =====================
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Boarding from "./pages/public/Boarding";
import Grooming from "./pages/public/Grooming";
import Training from "./pages/public/Training";
import ContactUs from "./pages/public/ContactUs";
import OurListings from "./pages/public/OurListings";
import ShoppingCart from "./pages/public/ShoppingCart";
import Login from "./pages/public/Login";

// ===================== Client Pages =====================
import Dashboard from "./pages/client/Dashboard";
import AddDog from "./pages/client/AddDog";
import Bookings from "./pages/client/Bookings";
import EditDog from "./pages/client/EditDog";
import MyDogs from "./pages/client/MyDogs";
import MyServices from "./pages/client/MyServices";
import Payments from "./pages/client/Payments";
import Profile from "./pages/client/Profile";

const App = () => {
  return (
     <AuthProvider>
    <Router>
      <Routes>
        {/* ===================== Public Routes ===================== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/boarding" element={<Boarding />} />
          <Route path="/grooming" element={<Grooming />} />
          <Route path="/training" element={<Training />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/our-listings" element={<OurListings />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* ===================== Protected Client Routes ===================== */}
        <Route element={<ProtectedRoutes><ClientLayout /></ProtectedRoutes>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-dogs/add-dog" element={<AddDog />} />
          <Route path="my-services/book-service" element={<Bookings />} />
          <Route path="/my-dogs/edit-dog" element={<EditDog />} />
          <Route path="/my-dogs" element={<MyDogs />} />
          <Route path="/my-services" element={<MyServices />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ===================== Catch-all ===================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
