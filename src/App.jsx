import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/layout/Layout/Layout.jsx";

// Pages
import Accueil from "./pages/Accueil/Accueil.jsx";
import APropos from "./pages/APropos/APropos.jsx";
import NosVoyages from "./pages/NosVoyages/NosVoyages.jsx";
import VoyagePersonnalise from "./pages/VoyagePersonnalise/VoyagePersonnalise.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import SignIn from "./pages/Auth/SignIn/SignIn.jsx";
import Register from "./pages/Auth/Register/Register.jsx";
import Entreprise from "./pages/Entreprise/Entreprise.jsx";
import Details from "./pages/Details/Details.jsx";
import GoogleCallback from "./pages/Auth/GoogleCallback/GoogleCallback.jsx";
import ResetPassword from "./pages/Auth/ResetPassword/ResetPassword.jsx";
import CompleteProfile from "./pages/CompleteProfile/CompleteProfile.jsx";
import ScrollToTop from "./components/layout/ScrollToTop/ScrollToTop.jsx";
import RevealOnScroll from "./components/layout/RevealOnScroll/RevealOnScroll.jsx";
import NosVoyagesDz from "./pages/NosVoyagesDz/NosVoyagesDz.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* On place ScrollToTop ici pour qu'il surveille la navigation */}
      <ScrollToTop />
      <RevealOnScroll />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/nos-voyages" element={<NosVoyages />} />
          <Route path="/nos-voyages-dz" element={<NosVoyagesDz />} />
          <Route path="/voyage-personnalise" element={<VoyagePersonnalise />} />
          <Route path="/entreprise" element={<Entreprise />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/details/:id" element={<Details />} />
        </Route>

        <Route path="/connect/google/callback" element={<GoogleCallback />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
