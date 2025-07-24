import React from "react";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollToTopButton";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-0">
        {children}
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default Layout;
