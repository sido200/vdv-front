import React, { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; 
import { useTranslation } from "react-i18next";
import axios from "axios";
import Swal from "sweetalert2";
import "./Register.css";
import { FcGoogle } from "react-icons/fc";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(value === password || value === "");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordMatch(value === confirmPassword || confirmPassword === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    setLoading(true);

    try {
      // ÉTAPE 1 : Inscription
      const registerResponse = await axios.post(`${STRAPI_URL}/api/auth/local/register`, {
        username: email.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password: password,
      });

      const { jwt, user } = registerResponse.data;

      // ÉTAPE 2 : Mise à jour du champ 'phone'
      await axios.put(
        `${STRAPI_URL}/api/users/${user.id}`,
        { phone: String(phone).trim() },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      localStorage.setItem("jwt", jwt);
      localStorage.setItem("user", JSON.stringify({ ...user, phone }));

      await Swal.fire({
        icon: "success",
        title: t("register.success"),
        confirmButtonColor: "#1a1c3d",
        timer: 3500,
      });
      navigate("/"); 
    } catch (err) {
      const strapiError = err.response?.data?.error?.message;
      // Traduction spécifique pour l'email déjà pris
      if (strapiError === "Email or Username are already taken") {
        setError(t("register.errors.email_taken"));
      } else {
        setError(t("register.errors.generic"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${STRAPI_URL}/api/connect/google`;
  };

  return (
    <div className="register-container">
      <button className="back-home-btn" onClick={() => navigate("/")}>
        <FaArrowLeft />
      </button>

      <div className="register-hero" />

      <div className="register-card">
        <h1 className="register-title">{t("register.title")}</h1>
        <p className="register-subtitle">{t("register.subtitle")}</p>

        {error && <div className="error-banner">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("register.fields.email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("register.fields.placeholders.email")}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("register.fields.phone")}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("register.fields.placeholders.phone")}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("register.fields.password")}</label>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>{t("register.fields.confirm_password")}</label>
            <div className="password-wrap">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="••••••••"
                required
                className={!passwordMatch ? "input-error" : ""}
              />
              <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword((v) => !v)} tabIndex={-1}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {!passwordMatch && (
              <p className="field-error">{t("register.errors.match")}</p>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? t("register.buttons.loading") : t("register.buttons.submit")}
          </button>

          <div className="separator"><span>{t("register.separator")}</span></div>

          <button type="button" className="google-btn" onClick={handleGoogleLogin}>
            <FcGoogle className="google-icon" />
            {t("register.buttons.google")}
          </button>
        </form>

        <p className="login-text">
          {t("register.footer.text")} <Link to="/signin" className="link-btn">{t("register.footer.link")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;