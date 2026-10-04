import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import "./Footer.css";
import Background from "../../../assets/images/Herobackground.jpg";

// Liens des réseaux sociaux : une icône n'apparaît que si son lien est renseigné
const SOCIAL_LINKS = [
  { url: "https://www.facebook.com/VillageDesVoyages/", icon: <FaFacebook />, label: "Facebook" },
  { url: "https://www.instagram.com/village_des_voyages/", icon: <FaInstagram />, label: "Instagram" },
  { url: "https://www.tiktok.com/@village_des_voyages", icon: <FaTiktok />, label: "TikTok" },
];

const AGENCY_PHONE = "tel:+21321371705";

export default function Footer() {
  const { t } = useTranslation();
  const socials = SOCIAL_LINKS.filter((s) => s.url);

  return (
    <footer className="footer">
      {/* CTA Banner */}
      <div className="footer-cta">
        <img
          src={Background}
          alt="Voyage passionnant"
          className="footer-cta-bg"
        />
        <div className="footer-cta-content">
          <h2>{t("footer.cta_title")}</h2>
          <p>{t("footer.cta_desc")}</p>
          <Link to="/contact">
            <button className="footer-cta-btn">{t("footer.contact_btn")}</button>
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-main-container">
          {/* Logo + Description */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span>Village</span> Des Voyages
            </div>
            <p>{t("footer.brand_desc")}</p>
            {socials.length > 0 && (
              <div className="footer-socials">
                {socials.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Support */}
          <div className="footer-column">
            <h4>{t("footer.support.title")}</h4>
            <ul>
              <li><Link to="/contact">{t("footer.support.customer_service")}</Link></li>
              <li><Link to="/#faq">{t("footer.support.faqs")}</Link></li>
              <li><Link to="/contact">{t("footer.support.feedback")}</Link></li>
              <li><a href={AGENCY_PHONE}>{t("footer.support.emergency")}</a></li>
            </ul>
          </div>

          {/* Entreprise */}
          <div className="footer-column">
            <h4>{t("footer.company.title")}</h4>
            <ul>
              <li><Link to="/contact">{t("footer.company.location")}</Link></li>
              <li><Link to="/a-propos">{t("footer.company.about")}</Link></li>
              <li><Link to="/entreprise">{t("footer.company.business", "Offres entreprises")}</Link></li>
              <li><Link to="/contact">{t("footer.company.contact")}</Link></li>
            </ul>
          </div>

          {/* Voyages (remplace la colonne Légal tant que les CGV / remboursement ne sont pas rédigées) */}
          <div className="footer-column">
            <h4>{t("footer.trips.title", "Voyages")}</h4>
            <ul>
              <li><Link to="/nos-voyages">{t("footer.trips.international", "Voyages à l'étranger")}</Link></li>
              <li><Link to="/nos-voyages-dz">{t("footer.trips.algeria", "Voyages en Algérie")}</Link></li>
              <li><Link to="/voyage-personnalise">{t("footer.trips.custom", "Voyage personnalisé")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright © {new Date().getFullYear()} Village des Voyages. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
