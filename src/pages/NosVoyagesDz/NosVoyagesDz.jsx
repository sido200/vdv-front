import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import qs from "qs";

import {
  FiCalendar,
  FiUsers,
  FiMapPin,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_LINK;
const STRAPI_URL = "http://localhost:1337";

const RangeFilter = ({
  label,
  icon,
  value,
  setValue,
  min,
  max,
  step = 1,
  formatValue,
}) => (
  <div className="filter-group">
    <label className="filter-label">
      {icon} {label}
    </label>
    <input
      type="range"
      className="filter-range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
    />
    <div className="range-display">
      {formatValue ? formatValue(value) : value}
    </div>
  </div>
);

const NosVoyagesDz = () => {
  const { t, i18n } = useTranslation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [startDate, setStartDate] = useState("");
  const [numPersons, setNumPersons] = useState(1);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageCount: 1 });

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const query = qs.stringify(
        {
          filters: {
            $and: [
              {
                $or: [{ local: { $eq: true } }, { local: { $null: true } }],
              },
              ...(searchName ? [{ name: { $contains: searchName } }] : []),
              { price: { $lte: maxPrice } },
            ],
          },
          pagination: { page, pageSize: 20 },
          populate: ["image", "disponibilite"],
        },
        { encodeValuesOnly: true },
      );

      const response = await axios.get(`${BASE_URL}/voyages?${query}`);
      const allVoyages = response.data.data || [];

      const filteredTrips = allVoyages.filter((trip) => {
        if (!trip.disponibilite || trip.disponibilite.length === 0)
          return false;
        return trip.disponibilite.some((disp) => {
          const isDateOk = startDate
            ? new Date(disp.date_depart) >= new Date(startDate)
            : true;
          const remainingPlaces =
            (disp.places_max || 0) - (disp.places_occup || 0);
          const isPlacesOk = remainingPlaces >= numPersons;
          return isDateOk && isPlacesOk;
        });
      });

      setTrips(filteredTrips);
      setPagination(response.data.meta.pagination);
    } catch (error) {
      console.error("Erreur de filtrage:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTrips();
    setIsDrawerOpen(false);
  };

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const FiltersContent = () => (
    <form onSubmit={handleSearch}>
      <div className="filter-group">
        <label className="filter-label">
          <FiMapPin className="icon-inline" /> {t("trips.dest_label")}
        </label>
        <input
          type="text"
          className="filter-input"
          placeholder={t("trips.search_placeholder")}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FiCalendar className="icon-inline" /> {t("trips.date_label")}
        </label>
        <input
          type="date"
          className="filter-input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FiUsers className="icon-inline" /> {t("trips.pax_label")}
        </label>
        <input
          type="number"
          min="1"
          className="filter-input"
          value={numPersons}
          onChange={(e) => setNumPersons(Number(e.target.value))}
        />
      </div>

      <RangeFilter
        label={t("trips.budget_label")}
        icon={<FiDollarSign className="icon-inline" />}
        value={maxPrice}
        setValue={setMaxPrice}
        min={0}
        max={1500000}
        step={10000}
        formatValue={(val) => `${formatNumber(val)} DZD`}
      />

      <button type="submit" className="search-btn">
        {t("trips.btn_search")}
      </button>
    </form>
  );

  return (
    <div className="nosvoyages-container">
      <div className="hero" />

      <button
        className="mobile-filter-btn"
        onClick={() => setIsDrawerOpen(true)}
      >
        <FiFilter /> {t("trips.mobile_filter")}
      </button>

      {isDrawerOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 className="filters-title">{t("trips.filters_title")}</h2>
              <button
                className="close-drawer"
                onClick={() => setIsDrawerOpen(false)}
              >
                <FiX size={24} />
              </button>
            </div>
            {FiltersContent()}
          </div>
        </div>
      )}

      <div className="content-wrapper">
        <aside className="filters-card desktop-filters">
          <h2 className="filters-title">{t("trips.filters_title")}</h2>
          {FiltersContent()}
        </aside>

        <section className="trips-grid-container">
          <div className="trips-grid">
            {loading ? (
              <div className="loading-state">{t("trips.loading")}</div>
            ) : trips.length > 0 ? (
              trips.map((trip) => {
                const bestOption =
                  trip.disponibilite.find((disp) => {
                    const checkDate = startDate
                      ? new Date(disp.date_depart) >= new Date(startDate)
                      : true;
                    const checkPlaces =
                      disp.places_max - disp.places_occup >= numPersons;
                    return checkDate && checkPlaces;
                  }) || trip.disponibilite[0];

                const remaining =
                  bestOption.places_max - bestOption.places_occup;

                return (
                  <Link
                    to={`/details/${trip.documentId}`}
                    key={trip.id}
                    className="trip-card"
                  >
                    <img
                      src={
                        trip.image?.[0]
                          ? `${STRAPI_URL}${trip.image[0].url}`
                          : "https://via.placeholder.com/400"
                      }
                      alt={trip.name}
                      className="trip-image"
                    />
                    <div className="trip-content">
                      <div>
                        <h3 className="trip-title">{trip.name}</h3>
                        <p className="trip-description">{trip.description}</p>
                        <div className="trip-meta">
                          <span className="meta-item">
                            <FiCalendar />{" "}
                            {new Date(
                              bestOption.date_depart,
                            ).toLocaleDateString(i18n.language)}
                          </span>
                          <span
                            className={`meta-item ${remaining < 3 ? "low-stock" : ""}`}
                          >
                            <FiUsers /> {remaining}{" "}
                            {t("trips.card.places_left")}
                          </span>
                        </div>
                      </div>
                      <div className="trip-bottom">
                        <span className="trip-price">
                          {formatNumber(trip.price)} DZD
                        </span>
                        <button className="more-btn">
                          {t("trips.card.details")}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="no-results">{t("trips.no_results")}</div>
            )}
          </div>

          {!loading && pagination.pageCount > 1 && (
            <div className="pagination-wrapper">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="page-nav-btn"
              >
                <FiChevronLeft />
              </button>
              <span className="page-text">
                {page} / {pagination.pageCount}
              </span>
              <button
                disabled={page === pagination.pageCount}
                onClick={() => setPage(page + 1)}
                className="page-nav-btn"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default NosVoyagesDz;
