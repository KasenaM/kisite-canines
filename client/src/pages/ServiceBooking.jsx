// src/pages/ServiceBooking.jsx
import React from "react";
import Layout from "../components/Layout";
import ServiceForm from "../components/ServiceForm";

function ServiceBooking() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#EAEAE8] px-4 py-10 sm:px-6 lg:px-10">
        <ServiceForm />
      </div>
    </Layout>
  );
}

export default ServiceBooking;
