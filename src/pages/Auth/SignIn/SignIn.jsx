import React, { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Swal from "sweetalert2";
import "./SignIn.css";
import { FcGoogle } from "react-icons/fc";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${STRAPI_URL}/api/auth/local`, {
        identifier: identifier,
        password: password,
      });

      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error?.message === "Invalid identifier or password"
          ? t("login.errors.invalid")
          : t("login.errors.generic"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${STRAPI_URL}/api/auth/forgot-password`, {
        email: resetEmail,
      });
      Swal.fire({
        icon: "success",
        title: t("login.modal.success_alert", { email: resetEmail }),
        confirmButtonColor: "#1a1c3d",
        timer: 3500,
      });
      setShowForgot(false);
      setResetEmail("");
    } catch {
      Swal.fire({
        icon: "error",
        title: t("login.errors.reset_error"),
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${STRAPI_URL}/api/connect/google`;
  };

  return (
    <div className="login-container">
      <button className="back-home-btn" onClick={() => navigate("/")}>
        <FaArrowLeft />
      </button>

      <div className="login-hero" />

      <div className="login-card">
        <h1 className="login-title">{t("login.title")}</h1>
        <p className="login-subtitle">{t("login.subtitle")}</p>

        {error && <p className="error-banner">{error}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>{t("login.fields.email")}</label>
            <input
              type="email"
              placeholder={t("login.fields.placeholder_email")}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("login.fields.password")}</label>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="forgot-link">
            <button
              type="button"
              className="link-btn"
              onClick={() => setShowForgot(true)}
            >
              {t("login.forgot_link")}
            </button>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? t("login.buttons.loading") : t("login.buttons.submit")}
          </button>

          <div className="separator">
            <span>{t("login.separator")}</span>
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="google-icon" />
            {t("login.buttons.google")}
          </button>
        </form>

        <p className="signup-text">
          {t("login.footer.text")}{" "}
          <Link to="/register" className="link-btn">
            {t("login.footer.link")}
          </Link>
        </p>
      </div>

      {showForgot && (
        <div className="modal-overlay" onClick={() => setShowForgot(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{t("login.modal.title")}</h2>
            <p className="modal-subtitle">{t("login.modal.subtitle")}</p>
            <form onSubmit={handleForgotSubmit}>
              <div className="form-group">
                <label>{t("login.fields.email")}</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder={t("login.fields.placeholder_email")}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForgot(false)}
                >
                  {t("login.modal.btn_cancel")}
                </button>
                <button type="submit" className="submit-btn">
                  {t("login.modal.btn_send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
