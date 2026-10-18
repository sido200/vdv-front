// Vérification des numéros de téléphone saisis dans les formulaires.
// Acceptés :
//   - mobile algérien : 05 / 06 / 07 + 8 chiffres  (ex. 0560 22 11 04)
//   - fixe algérien   : 02 / 03 / 04 + 7 chiffres  (ex. 021 37 17 05)
//   - les mêmes avec l'indicatif +213 ou 00213 (sans le 0)
//   - un numéro étranger au format international : +33 6 12 34 56 78
// Les espaces, points, tirets et parenthèses sont ignorés.

const DZ_MOBILE = /^0[567]\d{8}$/;
const DZ_FIXE = /^0[234]\d{7}$/;
const INTERNATIONAL = /^\+\d{8,15}$/;

// Renvoie le numéro nettoyé (ex. "0560221104" ou "+33612345678"), ou null s'il est invalide.
export const normalizePhone = (raw = "") => {
  let n = String(raw).trim().replace(/[\s.\-()/]/g, "");
  if (n.startsWith("00")) n = `+${n.slice(2)}`;
  if (n.startsWith("+213")) n = `0${n.slice(4)}`;
  if (DZ_MOBILE.test(n) || DZ_FIXE.test(n)) return n;
  if (INTERNATIONAL.test(n)) return n;
  return null;
};

export const isValidPhone = (raw) => normalizePhone(raw) !== null;
