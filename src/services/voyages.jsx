import axios from "axios";

axios.defaults.withCredentials = true;
export const BASE_URL = import.meta.env.VITE_API_LINK;

// On ajoute ?populate=* pour récupérer images, catégories et disponibilités
export const GetVoyage = () =>
  axios.get(`${BASE_URL}/voyages`, {
    params: {
      "filters[local][$eq]": false,
      populate: "*",
    },
  });

// Note : Pour un ID, on utilise généralement .get et non .post
// Force le peuplement spécifique des catégories et de l'image
export const GetVoyageById = (id) => {
  // On construit l'URL avec les noms EXACTS de ta capture d'écran
  const url = `${BASE_URL}/voyages/${id}?populate[0]=image&populate[1]=categories&populate[2]=disponibilite`;
  return axios.get(url);
};
export const GetVoyage2 = (page = 1, pageSize = 10) => {
  return axios.get(`${BASE_URL}/voyages`, {
    params: {
      "filters[local][$eq]": false,
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      populate: "*",
    },
  });
};

// Récupérer les réservations de l'utilisateur connecté
export const GetUserReservations = async (userId, token) => {
  return await axios.get(`${BASE_URL}/reservations`, {
    params: {
      "filters[users_permissions_user][id][$eq]": userId, // ← nom exact du champ
      "populate[voyage]": true,
    },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Récupérer les demandes perso de l'utilisateur connecté
export const GetUserPersoTrips = async (userId, token) => {
  return await axios.get(`${BASE_URL}/perso-trips`, {
    params: {
      "filters[owner][id][$eq]": userId, // ← nom exact du champ
    },
    headers: { Authorization: `Bearer ${token}` },
  });
};
