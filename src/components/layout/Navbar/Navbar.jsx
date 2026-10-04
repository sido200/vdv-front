import { useState } from "react"; // Ajout de useEffect
import { useTranslation } from "react-i18next";
import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineGlobeAlt,
  HiLogout, // Icône pour le logout
  HiUser,
} from "react-icons/hi";
import { NavLink, Link } from "react-router-dom"; // Ajout de useNavigate
import LOGO from "../../../assets/LOGO.png";
import "./Navbar.css";

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // --- LOGIQUE D'AUTH DYNAMIQUE ---
  // On vérifie si le token existe dans le localStorage
  const isLoggedIn = !!localStorage.getItem("jwt");

  // -------------------------------

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.about"), path: "/a-propos" },
    { name: t("nav.trips"), path: "/nos-voyages" },
    { name: t("nav.local"), path: "/nos-voyages-dz" },
    { name: t("nav.customTrip"), path: "/voyage-personnalise" },
    { name: t("nav.Entreprise"), path: "/entreprise" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo-container">
            <img src={LOGO} className="navbar-logo" alt="Logo" />
          </Link>

          <div className="navbar-links-desktop">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "navbar-link active" : "navbar-link"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="navbar-right-desktop">
            <div className="navbar-lang">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="navbar-lang-btn"
              >
                <HiOutlineGlobeAlt size={20} />
              </button>
              {isLangOpen && (
                <div className="navbar-lang-dropdown">
                  <button
                    onClick={() => changeLanguage("fr")}
                    className={`lang-item ${i18n.language === "fr" ? "active" : ""}`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`lang-item ${i18n.language === "en" ? "active" : ""}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => changeLanguage("ar")}
                    className={`lang-item ${i18n.language === "ar" ? "active" : ""}`}
                  >
                    AR
                  </button>
                </div>
              )}
            </div>

            {/* AFFICHAGE CONDITIONNEL DES BOUTONS */}
            {isLoggedIn ? (
              <div className="navbar-user-actions">
                <Link to="/profile">
                  <HiUser color="#0F1327" size={20} />
                </Link>
              </div>
            ) : (
              <NavLink to="/signin" className="navbar-auth-btn">
                {t("auth.signin")}
              </NavLink>
            )}
          </div>

          <button onClick={toggleDrawer} className="navbar-burger">
            <HiOutlineMenuAlt3 size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="drawer-backdrop" onClick={closeDrawer}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeDrawer} className="drawer-close">
              <HiOutlineX size={28} />
            </button>

            <nav className="drawer-links">
              <span className="divider"></span>

              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? "drawer-link active" : "drawer-link"
                  }
                  onClick={closeDrawer}
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="drawer-lang">
                <p className="drawer-lang-title">
                  <HiOutlineGlobeAlt size={20} /> {t("common.language")}
                </p>
                <div className="drawer-lang-options">
                  <button
                    onClick={() => changeLanguage("fr")}
                    className={`lang-btn ${i18n.language === "fr" ? "active" : ""}`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`lang-btn ${i18n.language === "en" ? "active" : ""}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("ar")}
                    className={`lang-btn ${i18n.language === "ar" ? "active" : ""}`}
                  >
                    العربية
                  </button>
                </div>
              </div>

              {/* AUTH MOBILE */}
              <div className="drawer-auth">
                {isLoggedIn ? (
                  <div className="navbar-user-actions">
                    <Link to="/profile">
                      <HiUser color="#0F1327" size={20} />
                    </Link>
                  </div>
                ) : (
                  <NavLink to="/signin" className="navbar-auth-btn">
                    {t("auth.signin")}
                  </NavLink>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
