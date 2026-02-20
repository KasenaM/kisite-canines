import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  
  useEffect(() => {
    const isHardReload = performance.navigation.type === 1;

    if (isHardReload) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200); 
    }
  }, []);

  return null;
};

export default ScrollToTop;
