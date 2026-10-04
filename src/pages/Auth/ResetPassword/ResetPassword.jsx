import React, { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Swal from "sweetalert2";
import "../SignIn/SignIn.css";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

// Page ouverte depuis le lien reçu par email : /reset-password?code=...
const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("reset.errors.mismatch"));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${STRAPI_URL}/api/auth/reset-password`, {
        code,
        password,
        passwordConfirmation: confirmPassword,
      });

      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      await Swal.fire({
        icon: "success",
        title: t("reset.success"),
        confirmButtonColor: "#1a1c3d",
        timer: 3500,
      });
      navigate("/");
    } catch {
      setError(t("reset.errors.invalid"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button className="back-home-btn" onClick={() => navigate("/")}>
        <FaArrowLeft />
      </button>

      <div className="login-hero" />

      <div className="login-card">
        <h1 className="login-title">{t("reset.title")}</h1>
        <p className="login-subtitle">{t("reset.subtitle")}</p>

        {!code ? (
          <p className="error-banner">{t("reset.errors.no_code")}</p>
        ) : (
          <>
            {error && <p className="error-banner">{error}</p>}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t("reset.new_password")}</label>
                <div className="password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
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

              <div className="form-group">
                <label>{t("reset.confirm_password")}</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? t("reset.loading") : t("reset.submit")}
              </button>
            </form>
          </>
        )}

        <p className="signup-text">
          <Link to="/signin" className="link-btn">
            {t("reset.back_to_login")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
