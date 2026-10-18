import { useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "./Entreprise.css";
import { PostContactEntreprise } from "../../services/entreprise";
import { normalizePhone } from "../../utils/phone";

const Entreprise = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  // Numéro mal écrit : le message s'affiche sous le champ
  const [phoneError, setPhoneError] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    entreprise: "",
    domaine: "",
    email: "",
    telephone: "",
    dateEvenement: "",
    nombreJours: "",
    transportBus: "non",
    details: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telephone") setPhoneError(false);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Téléphone obligatoire et bien écrit, email facultatif
    const telephone = normalizePhone(formData.telephone);
    if (!telephone) {
      setPhoneError(true);
      const field = e.target.elements.telephone;
      field?.focus({ preventScroll: true });
      field?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    setLoading(true);

    try {
      await PostContactEntreprise({ ...formData, telephone, email: formData.email.trim() || null });

      Swal.fire({
        icon: "success",
        title: t("entreprise.alerts.success_title"),
        text: t("entreprise.alerts.success_text"),
        confirmButtonColor: "#1a1c3d",
      });

      setFormData({
        nom: "",
        prenom: "",
        entreprise: "",
        domaine: "",
        email: "",
        telephone: "",
        dateEvenement: "",
        nombreJours: "",
        transportBus: "non",
        details: "",
      });

    } catch (error) {
      console.error("Erreur envoi entreprise:", error);
      Swal.fire({
        icon: "error",
        title: t("entreprise.alerts.error_title"),
        text: t("entreprise.alerts.error_text"),
      });
    } finally {
      setLoading(false);
    }
  };

  const services = t("entreprise.services", { returnObjects: true }) || [];

  return (
    <div className="entreprise-page">
      <div className="entreprise-hero">
        <div className="hero-overlay" />
        <div className="entreprise-label">
          <span className="hero-badge">{t("entreprise.hero.badge")}</span>
          <h1 className="hero-title">{t("entreprise.hero.title")}</h1>
          <p className="hero-subtitle">{t("entreprise.hero.subtitle")}</p>
        </div>
      </div>

      <div className="services-section">
        {services.map((s, i) => (
          <div className="service-card" key={i}>
          
            <h3 className="service-title">{s.title}</h3>
            <p className="service-desc">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="formulaire-section">
        <h2 className="formulaire-title">{t("entreprise.form.title")}</h2>

        <form onSubmit={handleSubmit} className="entreprise-form">
          <div className="form-row">
            <div className="form-group">
              <label>{t("entreprise.form.nom")}</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} required disabled={loading} />
            </div>
            <div className="form-group">
              <label>{t("entreprise.form.prenom")}</label>
              <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required disabled={loading} />
            </div>
          </div>

          <div className="form-group full-width">
            <label>{t("entreprise.form.company")}</label>
            <input type="text" name="entreprise" value={formData.entreprise} onChange={handleChange} required disabled={loading} />
          </div>

          <div className="form-group full-width">
            <label>{t("entreprise.form.activity")}</label>
            <input type="text" name="domaine" value={formData.domaine} onChange={handleChange} required disabled={loading} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ent-phone">{t("entreprise.form.phone")} *</label>
              <input
                id="ent-phone" type="tel" name="telephone" value={formData.telephone} onChange={handleChange}
                onBlur={(e) => setPhoneError(Boolean(e.target.value) && !normalizePhone(e.target.value))}
                placeholder={t("forms.phone_placeholder")} autoComplete="tel" inputMode="tel" required disabled={loading}
                aria-invalid={phoneError} aria-describedby={phoneError ? "ent-phone-error" : undefined}
              />
              {phoneError && <p id="ent-phone-error" className="field-error">{t("forms.phone_invalid")}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="ent-email">{t("entreprise.form.email")} <span className="field-optional">({t("forms.optional")})</span></label>
              <input id="ent-email" type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" disabled={loading} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t("entreprise.form.event_date")}</label>
              <input type="date" name="dateEvenement" value={formData.dateEvenement} onChange={handleChange} required disabled={loading} />
            </div>
            <div className="form-group">
              <label>{t("entreprise.form.days_count")}</label>
              <input type="number" name="nombreJours" value={formData.nombreJours} onChange={handleChange} min="1" required disabled={loading} />
            </div>
          </div>

          <div className="form-group full-width radio-group">
            <label>{t("entreprise.form.transport_q")}</label>
            <div className="radio-options">
              <label>
                <input type="radio" name="transportBus" value="oui" checked={formData.transportBus === "oui"} onChange={handleChange} disabled={loading} />
                {t("entreprise.form.yes")}
              </label>
              <label>
                <input type="radio" name="transportBus" value="non" checked={formData.transportBus === "non"} onChange={handleChange} disabled={loading} />
                {t("entreprise.form.no")}
              </label>
            </div>
          </div>

          <div className="form-group full-width">
            <label>{t("entreprise.form.details")}</label>
            <textarea name="details" value={formData.details} onChange={handleChange} rows="6" placeholder={t("entreprise.form.details_placeholder")} disabled={loading} />
          </div>

          <button type="submit" className="envoyer-btn" disabled={loading}>
            {loading ? t("entreprise.form.sending") : t("entreprise.form.btn_send")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Entreprise;