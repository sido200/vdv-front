import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Users, Calendar, Euro } from "lucide-react";
import Swal from "sweetalert2";
import "./Accueil.css";

// ASSETS

import Discount1 from "../../assets/images/local (1).jpg";
import Discount2 from "../../assets/images/local (2).jpg";
import Discount3 from "../../assets/images/local (3).jpg";
import Discount4 from "../../assets/images/local (4).jpg";

// SERVICES
import { GetVoyage2 } from "../../services/voyages";
import { Perso } from "../../services/perso";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const SLIDES = [
  {
    image:
      "https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg?auto=compress&w=1600",
    country: "Égypte",
    tagline:
      "Sur les traces des pharaons, entre histoire éternelle et Nil majestueux.",
  },
  {
    image:
      "https://images.pexels.com/photos/236294/pexels-photo-236294.jpeg?auto=compress&w=1600",
    country: "Russie",
    tagline: "De Moscou à Saint-Pétersbourg, une épopée impériale sans fin.",
  },
  {
    image:
      "https://images.pexels.com/photos/11974783/pexels-photo-11974783.jpeg?auto=compress&w=1600",
    country: "Djanet",
    tagline: "Le Sahara dans sa pureté absolue, entre dunes et art rupestre.",
  },
  {
    image:
      "https://images.pexels.com/photos/2174656/pexels-photo-2174656.jpeg?auto=compress&w=1600",
    country: "Vietnam",
    tagline: "Des rizières aux baies mythiques, un voyage d'émotions infinies.",
  },
  {
    image:
      "https://images.pexels.com/photos/9336144/pexels-photo-9336144.jpeg?auto=compress&w=1600",
    country: "Timimoun",
    tagline: "L'oasis rouge du désert, un mirage vivant au cœur du Sahara.",
  },
  {
    image:
      "https://images.pexels.com/photos/186457/pexels-photo-186457.jpeg?auto=compress&w=1600",
    country: "Azerbaïdjan",
    tagline: "Entre feu et modernité, la perle du Caucase inattendue.",
  },
  {
    image:
      "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&w=1600",
    country: "Maldives",
    tagline: "Le paradis sur eau turquoise, luxe et sérénité à l'infini.",
  },
  {
    image:
      "https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg?auto=compress&w=1600",
    country: "Bali",
    tagline: "Slow life, vibes tropicales et énergie spirituelle.",
  },
  {
    image:
      "https://images.pexels.com/photos/27118625/pexels-photo-27118625.jpeg?auto=compress&w=1600",
    country: "Malaisie",
    tagline: "L'Asie moderne, vibrante et multiculturelle.",
  },
];

const TESTIMONIALS = [
  {
    name: "Anais Tifoudine",
    location: "Egypte",
    avatar: "AT",
    rating: 5,
    text: "Bonjour,❤️ Je tiens à vous remercier du fond du cœur pour les merveilleux moments que j'ai pu vivre grâce à vos services. Chaque voyage organisé avec vous a été une expérience unique, pleine de découvertes, de détente et de souvenirs inoubliables. Votre professionnalisme, votre disponibilité et votre attention aux détails font vraiment la différence. Hâte de repartir bientôt à vos côtés pour de nouvelles aventures 🙏",
  },
  {
    name: "imane Ouahib",
    location: "Ghradaia, Algerie",
    avatar: "IO",
    rating: 5,
    text: "Service exceptionnel ! Organisation soignée et prestations de grande qualité. Je recommande cette agence pour une expérience de voyage mémorable ❤️",
  },
  {
    name: "Amel ben",
    location: "Algerie",
    avatar: "AB",
    rating: 5,
    text: "Bonjour à toute l'équipe, Un grand merci pour votre accompagnement et votre disponibilité. Mon voyage a été une réussite du début à la fin, et c'est en grande partie grâce à vous. Je garderai de très beaux souvenirs et je penserai à vous pour mes prochaines aventures ",
  },
  {
    name: "Nadia Saidj",
    location: "Istanbul, Turquie",
    avatar: "NS",
    rating: 5,
    text: "Je tiens à remercier l'agence VILLAGE DES VOYAGES pour son professionnalisme et sa gentillesse des les premiers échanges. Tout a été clair et bien expliqué, aussi bien avant le départ ,que pendant le voyage , prise en charge impeccables aux aéroports d'Alger et Istanbul ,ou lors des transports. L'hôtel choisi propre et confortable, idéalement situé à proximité des transports . excellent petit déjeuner...",
  },
];

const StarRating = ({ count }) => (
  <div className="testimonial-stars">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i}>★</span>
    ))}
  </div>
);

const TestimonialsCarousel = ({ testimonials }) => {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const updateVisibleCount = () => {
      const w = window.innerWidth;
      if (w <= 600) setVisibleCount(1);
      else if (w <= 1200) setVisibleCount(2);
      else setVisibleCount(4);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const slideWidth = 100 / visibleCount;

  return (
    <div className="testimonials-carousel">
      <div
        className="testimonials-track"
        style={{ transform: `translateX(-${index * slideWidth}%)` }}
      >
        {testimonials
          .concat(testimonials.slice(0, visibleCount))
          .map((t, i) => (
            <div
              className="testimonial-slide"
              style={{ flex: `0 0 ${slideWidth}%` }}
              key={i}
            >
              <div className="testimonial-card">
                <StarRating count={t.rating} />
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-location">{t.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="testimonials-dots">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`testimonial-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className={`faq-item ${isOpen ? "open" : ""}`}>
    <button className="faq-question" onClick={onToggle}>
      <span className="question-text">{question}</span>
      <span className={`faq-icon ${isOpen ? "rotated" : ""}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
    <div className="faq-answer-wrapper">
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  </div>
);

const Accueil = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openFAQIndex, setOpenFAQIndex] = useState(0);
  const [destinations, setDestinations] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    Destination: "",
    nbr: 1,
    date: "",
    budget: "",
  });

  const [activeSlide, setActiveSlide] = useState(0);

  const faqs = t("home.faq.items", { returnObjects: true }) || [];

  useEffect(() => {
    fetchVoyages(1);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchVoyages = (pageNum) => {
    setLoadingMore(true);
    GetVoyage2(pageNum, 10)
      .then((res) => {
        const newData = res.data.data;
        const meta = res.data.meta.pagination;
        setDestinations((prev) =>
          pageNum === 1 ? newData : [...prev, ...newData],
        );
        setHasMore(meta.page < meta.pageCount);
        setLoadingMore(false);
      })
      .catch((err) => {
        console.error("Error fetching voyages:", err);
        setLoadingMore(false);
      });
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVoyages(nextPage);
  };

  const handlePersoSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");

    if (!token) {
      Swal.fire({
        icon: "info",
        title: t("home.alerts.login_required_title"),
        text: t("home.alerts.login_required_text"),
        showCancelButton: true,
        confirmButtonText: t("home.alerts.login_btn"),
        cancelButtonText: t("home.alerts.later_btn"),
        confirmButtonColor: "#1a1c3d",
      }).then((result) => {
        if (result.isConfirmed) navigate("/SignIn");
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await Perso(formData, null, token);
      Swal.fire({
        icon: "success",
        title: t("home.alerts.success_title"),
        text: t("home.alerts.success_text"),
        confirmButtonColor: "#1a1c3d",
        timer: 3500,
      });
      setFormData({ Destination: "", nbr: 1, date: "", budget: "" });
    } catch {
      Swal.fire({
        icon: "error",
        title: t("home.alerts.error_title"),
        text: t("home.alerts.error_text"),
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="accueil-page">
      <section className="hero-form-section">
        <div className="hero-bg-wrapper">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`hero-slide ${i === activeSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
          <div className="hero-overlay" />

          <div className="hero-text-content">
            <div key={activeSlide} className="hero-text-inner">
              <span className="hero-badge-pill">Voyage Organisé</span>
              <h1 className="hero-headline">{SLIDES[activeSlide].country}</h1>
              <p className="hero-tagline">{SLIDES[activeSlide].tagline}</p>
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-header">
              <h2 className="form-card-title">{t("home.hero.title")}</h2>
            </div>
            <form onSubmit={handlePersoSubmit}>
              <div className="hero-form-row">
                <div className="hero-field">
                  <label>{t("home.hero.dest_label")}</label>
                  <div className="hero-input-wrap">
                    <MapPin size={16} />
                    <input
                      type="text"
                      placeholder={t("home.hero.dest_placeholder")}
                      value={formData.Destination}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Destination: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="hero-field">
                  <label>{t("home.hero.pax_label")}</label>
                  <div className="hero-input-wrap">
                    <Users size={16} />
                    <input
                      type="number"
                      min="1"
                      value={formData.nbr}
                      onChange={(e) =>
                        setFormData({ ...formData, nbr: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="hero-field">
                  <label>{t("home.hero.date_label")}</label>
                  <div className="hero-input-wrap">
                    <Calendar size={16} />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="hero-form-row hero-form-row2">
                <div className="hero-field">
                  <label>{t("home.hero.budget_label")}</label>
                  <div className="hero-input-wrap">
                    <Euro size={16} />
                    <input
                      type="number"
                      placeholder="DZD"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="hero-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("home.hero.btn_loading")
                    : t("home.hero.btn_send")}
                </button>
              </div>
            </form>
          </div>

          <div className="slide-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`slide-dot ${i === activeSlide ? "active" : ""}`}
                onClick={() => setActiveSlide(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="destinations-section">
        <div className="destinations-container">
          <div className="destinations-header">
            <span className="section-badge">
              {t("home.destinations.badge")}
            </span>
            <h2 className="section-title">{t("home.destinations.title")}</h2>
          </div>

          <div className="destinations-grid">
            {destinations.map((dest) => (
              <Link
                to={`/details/${dest.documentId}`}
                key={dest.id}
                className="destination-card"
              >
                <div className="card-image">
                  <img
                    src={
                      dest.image?.[0]
                        ? `${STRAPI_URL}${dest.image[0].url}`
                        : "https://via.placeholder.com/400"
                    }
                    alt={dest.name}
                  />
                </div>
                <div className="card-content">
                  <h3>{dest.name}</h3>
                  <p>{dest.description?.substring(0, 85)}...</p>
                  <div className="card-footer">
                    <span className="price">
                      {dest.price?.toLocaleString()}{" "}
                      {t("home.destinations.currency")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="voir-plus-wrapper">
              <button
                className="voir-plus-btn"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore
                  ? t("home.destinations.loading")
                  : t("home.destinations.load_more")}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="family-promo-section">
        <div className="family-promo-container">
          <div className="family-content">
            <h2 className="family-title">{t("home.promo.title")}</h2>
            <p>{t("home.promo.subtitle")}</p>
            <Link to="/nos-voyages-dz">
              <button className="family-cta">{t("home.promo.cta")}</button>
            </Link>
          </div>

          {/* Nouveau composant Scroll */}
          <div className="family-scroll-wrapper">
            <div className="family-scroll-track">
              {/* Premier groupe de 4 images (grid 2x2) */}
              <div className="family-grid">
                <img src={Discount1} alt="Promo 1" className="scroll-img" />
                <img src={Discount2} alt="Promo 2" className="scroll-img" />
                <img src={Discount3} alt="Promo 3" className="scroll-img" />
                <img src={Discount4} alt="Promo 4" className="scroll-img" />
              </div>

              {/* Deuxième groupe identique pour assurer la boucle fluide */}
              <div className="family-grid" aria-hidden="true">
                <img src={Discount1} alt="Promo 1" className="scroll-img" />
                <img src={Discount2} alt="Promo 2" className="scroll-img" />
                <img src={Discount3} alt="Promo 3" className="scroll-img" />
                <img src={Discount4} alt="Promo 4" className="scroll-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <span className="section-badge">Témoignages</span>
            <h2 className="section-title">Ce que disent nos voyageurs</h2>
          </div>
          <TestimonialsCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-container">
          <div className="faq-header">
            <span className="faq-badge">{t("home.faq.badge")}</span>
            <h2 className="faq-title">{t("home.faq.title")}</h2>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <FAQItem
                key={index}
                question={item.q}
                answer={item.a}
                isOpen={openFAQIndex === index}
                onToggle={() =>
                  setOpenFAQIndex(openFAQIndex === index ? -1 : index)
                }
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
