import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Récupère l'emplacement actuel (URL)
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Ancre (#faq…) : on attend le rendu de la page puis on y descend
    if (hash) {
      const timer = setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
    // Remonte en haut de la page dès que le chemin change
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null; // Ce composant ne rend rien visuellement
};

export default ScrollToTop;
