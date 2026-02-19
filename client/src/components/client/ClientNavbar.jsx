// src/components/ClientDashboardNavbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ClientDashboardNavbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-[#303A40] h-16 flex items-center px-4 shadow z-40">
      {/* Mobile Hamburger / Close */}
      <button
        className="md:hidden text-[#EAEAE6]"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Logo */}
      <Link to="/dashboard" className="mx-auto md:mx-0">
        <img src="/images/doglogo.png" alt="Kisite Logo" className="h-9" />
      </Link>

      {/* User Initials */}
      <div className="relative ml-auto" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((p) => !p)}
          className="w-9 h-9 rounded-full bg-[#D7CD43] text-[#303A40] flex items-center justify-center font-semibold text-sm"
        >
          {getInitials(user?.name)}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-[#4F6866] rounded shadow-lg overflow-hidden">
            <button
              onClick={handleLogout}
              className="block w-full text-[#EAEAE6] px-4 py-2 hover:bg-[#D7CD43] hover:text-[#303A40]"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ClientDashboardNavbar;
