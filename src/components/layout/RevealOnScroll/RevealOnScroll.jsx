import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./RevealOnScroll.css";

// Éléments animés à leur apparition à l'écran, sur toutes les pages
const SELECTORS = [
  // Titres de sections
  ".section-badge", ".section-title", ".faq-badge", ".faq-title",
  ".main-title", ".form-title", ".info-title", ".socials-title", ".filters-title",
  // Cartes et listes
  ".destination-card", ".trip-card", ".info-card", ".service-card", ".step-card",
  ".item-card", ".faq-item", ".testimonials-carousel",
  // Blocs
  ".family-content", ".family-scroll-wrapper", ".contact-form-wrapper", ".info-map",
  ".contact-socials", ".vp-form", ".profile-header", ".voir-plus-wrapper",
  ".login-card", ".register-card",
  // Footer
  ".footer-cta-content", ".footer-brand", ".footer-column",
].join(",");

// Cartes dans une grille : apparition en cascade
const STAGGERED = new Set(["destination-card", "trip-card", "info-card", "service-card", "step-card", "item-card", "faq-item", "footer-column"]);

const RevealOnScroll = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          io.unobserve(el);
          el.classList.add("is-visible");
          // Une fois l'animation finie, on rend l'élément à son style d'origine (hover, etc.)
          el.addEventListener(
            "animationend",
            () => {
              el.classList.remove("reveal", "is-visible");
              el.style.removeProperty("--reveal-delay");
            },
            { once: true }
          );
        });
      },
      // threshold 0 : un bloc très haut (formulaire) apparaît dès que son haut entre à l'écran
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );

    const scan = () => {
      document.querySelectorAll(SELECTORS).forEach((el) => {
        if (el.dataset.revealed) return;
        el.dataset.revealed = "1";

        const staggered = [...el.classList].some((c) => STAGGERED.has(c));
        if (staggered && el.parentElement) {
          const i = Math.max(0, [...el.parentElement.children].indexOf(el));
          el.style.setProperty("--reveal-delay", `${(i % 6) * 90}ms`);
        }
        el.classList.add("reveal");
        io.observe(el);
      });
    };

    scan();
    // Contenu chargé plus tard (voyages depuis l'API, « Voir plus »…)
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
      // Éléments persistants (footer) pas encore apparus : à ré-observer sur la page suivante
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
        delete el.dataset.revealed;
      });
    };
  }, [pathname]);

  return null;
};

export default RevealOnScroll;
