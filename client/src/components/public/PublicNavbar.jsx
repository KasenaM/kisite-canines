import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext"; // ✅ IMPORTED

function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart } = useCart(); // ✅ USING GLOBAL CART

  const isHomePage = location.pathname === "/";
  const isAboutPage = location.pathname === "/about-us";
  const isServicesPage = ["/training"].includes(location.pathname);
  const isListingsPage = location.pathname === "/our-listings";
  const isTransparentPage =
    isHomePage || isAboutPage || isServicesPage || isListingsPage;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navbarBase =
    "fixed top-0 left-0 w-full px-4 py-4 z-50 transition-all duration-300";

  const navbarColor = isTransparentPage
    ? scrolled
      ? "bg-[#303A40] shadow rounded-b-xl"
      : "bg-transparent"
    : "bg-[#303A40] shadow rounded-b-xl";

  const handleAccountClick = () => {
    if (user) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <nav className={`${navbarBase} ${navbarColor}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full relative">
        
        {/* Mobile: Hamburger (Left) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-7 h-7 text-[#EAEAE6]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <img
            src="/images/doglogo.png"
            alt="Kisite Logo"
            className="h-10"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-center">
          <ul className="flex space-x-10 font-medium text-[#EAEAE6]">
            <li>
              <Link to="/" className="hover:text-[#CFBE3A]">
                Home
              </Link>
            </li>

            <li>
              <Link to="/about-us" className="hover:text-[#CFBE3A]">
                About Us
              </Link>
            </li>

            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="hover:text-[#CFBE3A]"
              >
                Services
              </button>

              {dropdownOpen && (
                <ul className="absolute left-0 top-full mt-2 bg-[#4F6866] border border-[#9BAFAF] rounded shadow-md p-2 space-y-1 z-10">
                  {["training", "grooming", "boarding"].map((service) => (
                    <li key={service}>
                      <Link
                        to={`/${service}`}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-1 text-[#EAEAE6] hover:bg-[#EAEAE6] hover:text-[#303A40] capitalize"
                      >
                        {service}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link to="/our-listings" className="hover:text-[#CFBE3A]">
                Our Listings
              </Link>
            </li>

            <li>
              <Link to="/contact-us" className="hover:text-[#CFBE3A]">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Cart + Account */}
        <div className="flex items-center gap-4">
          
          {/* Cart */}
          <Link to="/cart" className="relative group">
            <svg
              className="w-6 h-6 text-[#EAEAE6]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7H19a1 1 0 001-1v-1H7m0 0H4M16 21a1 1 0 11-2 0 1 1 0 012 0zm-8 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>

            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#CFBE3A] text-[#303A40] rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}

            <span className="hidden md:block absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs bg-[#D7CD43] text-[#303A40] px-2 py-0.5 rounded opacity-0 md:group-hover:opacity-100 transition pointer-events-none">
              Cart
            </span>
          </Link>

          {/* Account */}
          <button onClick={handleAccountClick} className="relative group">
            <svg
              className="w-6 h-6 text-[#EAEAE6]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A4 4 0 019 16h6a4 4 0 013.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <span className="hidden md:block absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs bg-[#D7CD43] text-[#303A40] px-2 py-0.5 rounded opacity-0 md:group-hover:opacity-100 transition pointer-events-none">
              Account
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 bg-[#4F6866] rounded-b-xl shadow-lg p-4 space-y-3">
          {[
            { path: "/", label: "Home" },
            { path: "/about-us", label: "About Us" },
            { path: "/training", label: "Training" },
            { path: "/grooming", label: "Grooming" },
            { path: "/boarding", label: "Boarding" },
            { path: "/our-listings", label: "Our Listings" },
            { path: "/contact-us", label: "Contact Us" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#EAEAE6] hover:text-[#CFBE3A]"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default PublicNavbar;