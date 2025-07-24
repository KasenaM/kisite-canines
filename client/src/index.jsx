import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { HelmetProvider } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './index.css';

function RootApp() {
  useEffect(() => {
    AOS.init({
      duration: 800,        // animation duration
      easing: 'ease-in-out', // animation easing
      once: true,            // whether animation should happen only once
      mirror: false,         // whether elements should animate out while scrolling past
    });
  }, []);

  return (
    <React.StrictMode>
      <HelmetProvider>
        <div className="overflow-x-hidden scroll-smooth">
          <CartProvider>
            <App />
          </CartProvider>
        </div>
      </HelmetProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<RootApp />);
