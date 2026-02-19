// src/layouts/ClientDashboardLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ClientDashboardNavbar from "../components/client/ClientNavbar";
import ClientSidebar from "../components/client/ClientSidebar";

const ClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-[#EAEAE8] flex flex-col overflow-hidden">
      {/* 1️⃣ TOP NAVBAR (full width, always on top) */}
      <ClientDashboardNavbar
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        isSidebarOpen={sidebarOpen}
      />

      {/* 2️⃣ BODY: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ClientSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
