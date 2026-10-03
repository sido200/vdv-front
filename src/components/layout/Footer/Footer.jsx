import React from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaTwitter, FaTiktok } from "react-icons/fa";
import "./Footer.css";
import Background from "../../../assets/images/Herobackground.jpg";

export default function Footer() {
  const { t } = useTranslation();

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
          <button className="footer-cta-btn">{t("footer.contact_btn")}</button>
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
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><FaFacebook /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><FaTwitter /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><FaLinkedin /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><FaYoutube /></a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-social-link"><FaTiktok /></a>
            </div>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h4>{t("footer.support.title")}</h4>
            <ul>
              <li><a href="#">{t("footer.support.customer_service")}</a></li>
              <li><a href="#">{t("footer.support.faqs")}</a></li>
              <li><a href="#">{t("footer.support.feedback")}</a></li>
              <li><a href="#">{t("footer.support.emergency")}</a></li>
            </ul>
          </div>

          {/* Entreprise */}
          <div className="footer-column">
            <h4>{t("footer.company.title")}</h4>
            <ul>
              <li><a href="#">{t("footer.company.location")}</a></li>
              <li><a href="#">{t("footer.company.about")}</a></li>
              <li><a href="#">{t("footer.company.careers")}</a></li>
              <li><a href="#">{t("footer.company.contact")}</a></li>
            </ul>
          </div>

          {/* Légal */}
          <div className="footer-column">
            <h4>{t("footer.legal.title")}</h4>
            <ul>
              <li><a href="#">{t("footer.legal.refund")}</a></li>
              <li><a href="#">{t("footer.legal.terms")}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright © Binnovant 2026</p>
        </div>
      </div>
    </footer>
  );
}