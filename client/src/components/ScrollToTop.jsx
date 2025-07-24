import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // On route change — scroll smoothly to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  // On hard reload — trigger smooth scroll up after short delay
  useEffect(() => {
    const isHardReload = performance.navigation.type === 1;

    if (isHardReload) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100); // delay slightly so DOM is ready
    }
  }, []);

  return null;
};

export default ScrollToTop;
