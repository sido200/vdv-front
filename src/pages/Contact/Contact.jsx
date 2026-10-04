import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import "./Contact.css";
import { PostContactB2B, PostContactB2C } from "../../services/contact";

const Contact = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("b2c");
  const [loading, setLoading] = useState(false);

  const [b2cForm, setB2cForm] = useState({ name: "", email: "", phone: "", description: "" });
  const [b2bForm, setB2bForm] = useState({ company: "", name: "", email: "", phone: "", site: "", description: "" });

  const handleB2CChange = (e) => setB2cForm({ ...b2cForm, [e.target.name]: e.target.value });
  const handleB2BChange = (e) => setB2bForm({ ...b2bForm, [e.target.name]: e.target.value });

  const onB2CSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await PostContactB2C(b2cForm);
      Swal.fire({
        icon: 'success',
        title: t("contact.alerts.success_b2c_title"),
        text: t("contact.alerts.success_b2c_text"),
        confirmButtonColor: '#1a1c3d',
      });
      setB2cForm({ name: "", email: "", phone: "", description: "" });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: t("contact.alerts.error_title"),
        text: t("contact.alerts.error_text"),
      });
    } finally {
      setLoading(false);
    }
  };

  const onB2BSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await PostContactB2B(b2bForm);
      Swal.fire({
        icon: 'success',
        title: t("contact.alerts.success_b2b_title"),
        text: t("contact.alerts.success_b2b_text"),
        confirmButtonColor: '#1a1c3d',
      });
      setB2bForm({ company: "", name: "", email: "", phone: "", site: "", description: "" });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: t("contact.alerts.error_title"),
        text: t("contact.alerts.error_text"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <div className="hero-overlay">
          <h1 className="hero-title">{t("contact.hero_title")}</h1>
          <p className="hero-subtitle">{t("contact.hero_subtitle")}</p>
        </div>
      </div>

      <div className="contact-tabs">
        <button className={`tab-btn ${activeTab === "b2c" ? "active" : ""}`} onClick={() => setActiveTab("b2c")}>
          {t("contact.tabs.b2c")}
        </button>
        <button className={`tab-btn ${activeTab === "b2b" ? "active" : ""}`} onClick={() => setActiveTab("b2b")}>
          {t("contact.tabs.b2b")}
        </button>
        <div className={`tab-indicator ${activeTab}`}></div>
      </div>

      <div className="contact-content">
        <div className="form-wrapper">
          {activeTab === "b2c" ? (
            <div className="contact-form-wrapper">
              <h2 className="form-title">{t("contact.form.b2c_title")}</h2>
              <p className="form-subtitle">{t("contact.form.b2c_subtitle")}</p>
              <form onSubmit={onB2CSubmit}>
                <div className="form-group">
                  <label>{t("contact.form.label_name")}</label>
                  <input type="text" name="name" value={b2cForm.name} onChange={handleB2CChange} placeholder={t("contact.form.placeholder_name")} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={b2cForm.email} onChange={handleB2CChange} placeholder="votre@email.com" required />
                </div>
                <div className="form-group">
                  <label>{t("contact.form.label_phone")}</label>
                  <input type="tel" name="phone" value={b2cForm.phone} onChange={handleB2CChange} placeholder="+213 ..." />
                </div>
                <div className="form-group">
                  <label>{t("contact.form.label_message")}</label>
                  <textarea name="description" value={b2cForm.description} onChange={handleB2CChange} rows="7" placeholder={t("contact.form.placeholder_msg")} required></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? t("contact.form.btn_loading") : t("contact.form.btn_send")}
                </button>
              </form>
            </div>
          ) : (
            <div className="contact-form-wrapper">
              <h2 className="form-title">{t("contact.form.b2b_title")}</h2>
              <p className="form-subtitle">{t("contact.form.b2b_subtitle")}</p>
              <form onSubmit={onB2BSubmit}>
                <div className="form-group">
                  <label>{t("contact.form.label_company")}</label>
                  <input type="text" name="company" value={b2bForm.company} onChange={handleB2BChange} placeholder="Ex: Binnovant" required />
                </div>
                <div className="form-group">
                  <label>{t("contact.form.label_name")}</label>
                  <input type="text" name="name" value={b2bForm.name} onChange={handleB2BChange} placeholder={t("contact.form.placeholder_name")} required />
                </div>
                <div className="form-group">
                  <label>{t("contact.form.label_email")}</label>
                  <input type="email" name="email" value={b2bForm.email} onChange={handleB2BChange} placeholder="contact@company.com" required />
                </div>
                <div className="form-group">
                  <label>{t("contact.form.label_phone")}</label>
                  <input type="tel" name="phone" value={b2bForm.phone} onChange={handleB2BChange} placeholder="+213 ..." required />
                </div>
                <div className="form-group">
                  <label>{t("contact.form.label_site")}</label>
                  <input type="url" name="site" value={b2bForm.site} onChange={handleB2BChange} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>{t("contact.form.label_message")}</label>
                  <textarea name="description" value={b2bForm.description} onChange={handleB2BChange} rows="7" placeholder={t("contact.form.placeholder_msg")} required></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? t("contact.form.btn_loading") : t("contact.form.btn_send")}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="info-wrapper">
          <h2 className="info-title">{t("contact.info.title")}</h2>

          <div className="info-map">
            <iframe
              title="Localisation Village des Voyages"
              src="https://maps.google.com/maps?q=36.7630748,2.9607064&z=17&output=embed"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="info-cards">
            <div className="info-card">
              <h3>{t("contact.info.address")}</h3>
              <p>Chéraga, Alger 16000<br />Algérie</p>
            </div>
            <div className="info-card">
              <h3>{t("contact.info.phone")}</h3>
              <p>
                <a href="tel:+21321371705">021 37 17 05</a><br />
                <a href="tel:+21321373278">021 37 32 78</a>
              </p>
            </div>
            <div className="info-card">
              <h3>{t("contact.info.email")}</h3>
              <p><a href="mailto:contact@villagedesvoyages.com">contact@villagedesvoyages.com</a></p>
            </div>
            <div className="info-card">
              <h3>{t("contact.info.hours")}</h3>
              <p>{t("contact.info.hours_val")}<br />{t("footer.company.saturday")}</p>
            </div>
          </div>

          <div className="contact-socials">
            <h3 className="socials-title">Suivez-nous</h3>
          <div className="socials-row">
  <a href="https://www.facebook.com/VillageDesVoyages/" target="_blank" rel="noopener noreferrer" className="social-link facebook" aria-label="Facebook"><FaFacebook /></a>
  <a href="https://www.instagram.com/village_des_voyages/" target="_blank" rel="noopener noreferrer" className="social-link instagram" aria-label="Instagram"><FaInstagram /></a>
  <a href="https://www.tiktok.com/@village_des_voyages" target="_blank" rel="noopener noreferrer" className="social-link tiktok" aria-label="TikTok"><FaTiktok /></a>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;