import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import WhatsAppButton from "../WhatsAppButton/WhatsAppButton.jsx";
import "./Layout.css";

const Layout = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Navbar />
      {/* key = chemin : l'animation d'entrée rejoue à chaque changement de page */}
      <div key={pathname} className="page-enter">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Layout;
