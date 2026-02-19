// src/components/ClientSidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Dog,
  Scissors,
  User,
  CreditCard,
  PlusCircle,
  X, // Added X icon to close the mobile overlay
} from "lucide-react";

const links = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { path: "/my-dogs", label: "My Dogs", icon: Dog },
  { path: "/my-services", label: "My Services", icon: Scissors },
  { path: "/payments", label: "Payments", icon: CreditCard },
  { path: "/profile", label: "Profile", icon: User },
];

const ClientSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* ================= Overlay (Mobile Only) ================= */}
      {/* This darkens the background when the sidebar is open on mobile */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={onClose}
      />

      {/* ================= Sidebar Container ================= */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50
          w-72 h-full bg-[#EAEAE8] shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:z-30 md:shadow-none md:flex md:w-64
          flex flex-col
        `}
      >
        {/* Mobile Header: Show close button inside the overlay for better UX */}
        <div className="flex items-center justify-between px-6 py-5 md:hidden border-b border-[#9BAFAF]/20">
          <span className="font-bold text-[#303A40] text-lg">Menu</span>
          <button onClick={onClose} className="text-[#303A40] hover:bg-gray-200 p-1 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200
                 ${
                   isActive
                     ? "bg-[#4F6866] text-[#EAEAE6] shadow-md"
                     : "text-[#303A40] hover:bg-[#CFBE3A]/20"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 3 : 2.5}
                    className={
                      isActive
                        ? "text-[#D7CD43]"
                        : "text-[#303A40]"
                    }
                  />
                  <span className="font-semibold">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom CTA Section */}
        <div className="p-4 border-t border-[#9BAFAF]/40 bg-[#EAEAE8]">
          <button
            onClick={() => {
              navigate("/book-service");
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#D7CD43] text-[#303A40] font-bold py-3.5 rounded-xl hover:brightness-95 active:scale-[0.98] transition-all shadow-sm"
          >
            <PlusCircle size={20} strokeWidth={2.5} />
            Book a Service
          </button>
        </div>
      </aside>
    </>
  );
};

export default ClientSidebar;