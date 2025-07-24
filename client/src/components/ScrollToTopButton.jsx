import React, { useState, useEffect } from "react";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-[#D7CD43] text-white text-2xl rounded-full px-4 py-3 shadow-lg z-[1000] hover:bg-[#C5BC39]  transition-opacity duration-300"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    )
  );
}

export default ScrollToTopButton;
