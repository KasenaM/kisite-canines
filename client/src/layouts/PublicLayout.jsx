import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/public/PublicNavbar";
import Footer from "../components/public/Footer";
import ScrollToTop from "../components/public/ScrollToTop";
import ScrollToTopButton from "../components/public/ScrollToTopButton";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <PublicNavbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default PublicLayout;
