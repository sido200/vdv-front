import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "./Details.css";
import { FiCalendar, FiMoon, FiUsers, FiX } from "react-icons/fi";
import { GetVoyageById } from "../../services/voyages";
import { CreateReservation } from "../../services/reservation";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [voyage, setVoyage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedDispo, setSelectedDispo] = useState(null);
  const [reservePeople, setReservePeople] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inputDate, setInputDate] = useState("");
  const [inputDays, setInputDays] = useState("");
  const [inputPeople, setInputPeople] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [activeFilters, setActiveFilters] = useState({
    date: "",
    days: "",
    people: "",
  });

  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

  useEffect(() => {
    GetVoyageById(id)
      .then((res) => {
        setVoyage(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching voyage:", err);
        setLoading(false);
      });
  }, [id]);

  const handleOpenModal = (dispo) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      Swal.fire({
        title: t("details.alerts.login_required_title"),
        text: t("details.alerts.login_required_text"),
        icon: "info",
        showCancelButton: true,
        confirmButtonText: t("details.alerts.login_confirm"),
        cancelButtonText: t("details.alerts.login_cancel"),
      }).then((result) => {
        if (result.isConfirmed) navigate("/signin");
      });
      return;
    }
    setSelectedDispo(dispo);
    setReservePeople(inputPeople || 1);
    setShowModal(true);
  };

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("jwt");
      const totalAmount = (selectedDispo.prix || voyage.price) * reservePeople;

      const payload = {
        data: {
          nb_personnes: parseInt(reservePeople),
          montant_total: totalAmount,
          date_reservation: new Date(),
          statut: "en_attente",
          user: userData.id,
          voyage: voyage.documentId,
          dispo_id: selectedDispo.id,
        },
      };

      await CreateReservation(payload, token);
      setShowModal(false);

      Swal.fire({
        title: t("details.alerts.success_title"),
        text: t("details.alerts.success_text"),
        icon: "success",
        confirmButtonColor: "#1a1c3d",
      });
    } catch (error) {
      Swal.fire({
        title: t("details.alerts.error_title"),
        text: t("details.alerts.error_text"),
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckAvailability = () => {
    setIsChecking(true);
    setTimeout(() => {
      setActiveFilters({
        date: inputDate,
        days: inputDays,
        people: inputPeople,
      });
      setIsChecking(false);
    }, 600);
  };

  const filteredDispos = voyage?.disponibilite?.filter((dispo) => {
    const matchDate = activeFilters.date
      ? dispo.date_depart === activeFilters.date
      : true;
    let matchDays = true;
    if (activeFilters.days) {
      const start = new Date(dispo.date_depart);
      const end = new Date(dispo.date_retour);
      const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
      matchDays = diffDays === parseInt(activeFilters.days);
    }
    const remainingPlaces = dispo.places_max - (dispo.places_occup || 0);
    const matchPeople = activeFilters.people
      ? remainingPlaces >= parseInt(activeFilters.people)
      : true;
    return matchDate && matchDays && matchPeople;
  });

  const formatDate = (dateString, options = {}) => {
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };

  if (loading)
    return <div className="page-wrapper">{t("details.loading")}</div>;
  if (!voyage)
    return <div className="page-wrapper">{t("details.not_found")}</div>;

  return (
    <div className="page-wrapper details-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              <FiX />
            </button>
            <h3>{t("details.modal.title")}</h3>
            <p>
              {t("details.modal.trip")} <strong>{voyage.name}</strong>
            </p>

            <div className="modal-body">
              <div className="info-line">
                <span>{t("details.modal.date")}</span>
                <span>{formatDate(selectedDispo.date_depart)}</span>
              </div>
              <div className="info-line">
                <label>{t("details.modal.people_count")}</label>
                <input
                  type="number"
                  value={reservePeople}
                  min="1"
                  max={
                    selectedDispo.places_max - (selectedDispo.places_occup || 0)
                  }
                  onChange={(e) => setReservePeople(e.target.value)}
                />
              </div>
              <div className="total-line">
                <span>{t("details.modal.total")}</span>
                <strong dir="ltr">
                  {(
                    (selectedDispo.prix || voyage.price) * reservePeople
                  ).toLocaleString()}{" "}
                  DZD
                </strong>
              </div>
            </div>
            <button
              className="confirm-btn"
              onClick={handleConfirmReservation}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("details.modal.processing")
                : t("details.modal.confirm_btn")}
            </button>
          </div>
        </div>
      )}

      <header className="header-top">
        <h1 className="main-title">{voyage.name}</h1>
        <div className="categories-container">
          {voyage.categories?.map((cat) => (
            <span key={cat.id} className="badge">
              {cat.name}
            </span>
          ))}
        </div>
      </header>

      <div className="container">
        <div className="content-main">
          <img
            className="main-image"
            src={
              voyage.image?.[activeImg]
                ? `${STRAPI_URL}${voyage.image[activeImg].url}`
                : "https://via.placeholder.com/800"
            }
            alt={voyage.name}
          />
          {voyage.image?.length > 1 && (
            <div className="thumbnail-grid">
              {voyage.image.map((img, i) => (
                <img
                  key={i}
                  src={`${STRAPI_URL}${img.url}`}
                  alt={`${voyage.name} ${i + 1}`}
                  onClick={() => setActiveImg(i)}
                  style={{
                    opacity: activeImg === i ? 1 : 0.55,
                    border:
                      activeImg === i
                        ? "2px solid #151936"
                        : "2px solid transparent",
                  }}
                />
              ))}
            </div>
          )}
          <section className="description">
            <h2>{t("details.description_title")}</h2>
            <p>{voyage.description}</p>
            <div className="main-price" dir="ltr">
              {voyage.price?.toLocaleString()} DZD
            </div>
          </section>

          <hr style={{ margin: "30px 0", border: "0.5px solid #eee" }} />

          <section className="availability">
            <h2>
              {t("details.availability_title")} ({filteredDispos?.length || 0})
            </h2>
            {filteredDispos && filteredDispos.length > 0 ? (
              filteredDispos.map((dispo, index) => (
                <div
                  className="availability-card"
                  key={index}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="transport-tag">
                    {t("details.transport_type")}{" "}
                    <strong>{dispo.type_transport || "Bus"}</strong>
                  </div>
                  <div className="date-row">
                    <div className="card-date">
                      <div className="date-info">
                        <span>{t("details.departure")}</span>
                        <strong>
                          {formatDate(dispo.date_depart, {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                          })}
                        </strong>
                      </div>
                      <div className="date-info">
                        <span>{t("details.return")}</span>
                        <strong>
                          {formatDate(dispo.date_retour, {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                          })}
                        </strong>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{ fontWeight: "bold", color: "#1a1c3d" }}
                          dir="ltr"
                        >
                          {dispo.prix?.toLocaleString() ||
                            voyage.price?.toLocaleString()}{" "}
                          DZD
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="selction-info">
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {t("details.places")}{" "}
                        {dispo.places_max - (dispo.places_occup || 0)}/
                        {dispo.places_max}
                      </div>
                      <button
                        className="btn-select"
                        onClick={() => handleOpenModal(dispo)}
                      >
                        {t("details.select")}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#888", fontStyle: "italic" }}>
                {t("details.no_slots")}
              </p>
            )}
          </section>
        </div>

        <aside className="sidebar details-sidebar">
          <div className="reservation-box">
            <h3
              style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}
            >
              {t("details.sidebar.title")}
            </h3>
            <div className="form-group">
              <label>{t("details.sidebar.date_label")}</label>
              <div className="input-container">
                <FiCalendar />
                <input
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t("details.sidebar.days_label")}</label>
              <div className="input-container">
                <FiMoon />
                <input
                  type="number"
                  placeholder="1"
                  value={inputDays}
                  onChange={(e) => setInputDays(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t("details.sidebar.people_label")}</label>
              <div className="input-container">
                <FiUsers />
                <input
                  type="number"
                  placeholder="1"
                  value={inputPeople}
                  onChange={(e) => setInputPeople(e.target.value)}
                />
              </div>
            </div>
            <button
              className={`btn-check ${isChecking ? "loading" : ""}`}
              onClick={handleCheckAvailability}
              disabled={isChecking}
            >
              {isChecking
                ? t("details.sidebar.checking")
                : t("details.sidebar.check_btn")}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Details;
