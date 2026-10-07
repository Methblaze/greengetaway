// The one list of attractions. Map, Map.web, Leaderboard, Add and Profile all
// read from here, so names, scores and band logic cannot drift apart again.
// Names, scores, coordinates and addresses are unchanged from the 2023 app,
// apart from settling the 2023 spelling drift on one name each.
import { colors } from "../theme/tokens";

export const BANDS = {
  low: { key: "low", label: "Low impact", range: "80 to 100", min: 80, color: colors.band.low },
  medium: { key: "medium", label: "Medium impact", range: "40 to 79", min: 40, color: colors.band.medium },
  high: { key: "high", label: "High impact", range: "Below 40", min: 0, color: colors.band.high },
};

export const BAND_ORDER = [BANDS.low, BANDS.medium, BANDS.high];

export const bandFor = (score) => (score >= BANDS.low.min ? BANDS.low : score >= BANDS.medium.min ? BANDS.medium : BANDS.high);

// Copy for the "How eco score works" sheet.
export const ECO_SCORE_EXPLAINER = {
  title: "How eco score works",
  intro: "Every attraction has a score from 0 to 100 based on its estimated emissions. The higher the score, the lower the impact.",
  method: [
    "All scores are approximations, worked out for the original 2023 project from available data and logical reasoning.",
    "Free outdoor places such as parks, lakes and landmarks score highest, since visiting them causes almost no emissions. Some lose a few points for related emissions, such as boat trips nearby or candles in churches.",
    "Zoologisk Have, the National Museum, Tivoli and Den Blå Planet were scored from published articles and sources on emissions, with reasoning about animals, feed, water and electricity.",
  ],
};

const RAW = [
  {
    id: "kastellet",
    name: "Kastellet",
    area: "Østerbro",
    score: 99,
    address: "Gl. Hovedvagt, Kastellet 1, 2100 København",
    coordinates: { latitude: 55.69269516489231, longitude: 12.594401456560474 },
    images: [
      "https://media.lex.dk/media/148200/standard_compressed_scanpixId20200618-192745-4",
      "https://media.lex.dk/media/148200/standard_compressed_scanpixId20200618-192745-4",
    ],
  },
  {
    id: "soerne",
    name: "Søerne",
    area: "Indre By",
    score: 99,
    address: "Øster Søgade, 1357 København",
    coordinates: { latitude: 55.68932350079579, longitude: 12.567072701450753 },
    images: [
      "https://2.bp.blogspot.com/-shMUZ2HD4KE/Tx_hl0KfwkI/AAAAAAAAAR4/svYxIDciARA/s1600/IMG_0897.JPG",
      "https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX35258857.jpg",
    ],
  },
  {
    id: "bibliotekshaven",
    name: "Bibliotekshaven",
    area: "Indre By",
    score: 98,
    address: "Proviantpassagen 1, 1218 København",
    coordinates: { latitude: 55.67479738955379, longitude: 12.581137072338239 },
    images: [
      "https://files.guidedanmark.org/files/382/153466__MG_5033.jpg",
      "https://migogkbh.dk/wp-content/uploads/2020/08/Bibliotekshaven.jpg",
    ],
  },
  {
    id: "amager-faelled",
    name: "Amager Fælled",
    area: "Amager",
    score: 98,
    address: "Artillerivej 73B, 2300 København",
    coordinates: { latitude: 55.65346745093697, longitude: 12.577147786658136 },
    images: [
      "https://naturibyen.com/wp-content/uploads/2017/06/Koebenhavn_S_20120808_TH_0049_web.jpg",
      "https://media-cdn.tripadvisor.com/media/photo-s/05/bf/34/72/amager-faelled.jpg",
    ],
  },
  {
    id: "havnestads-havnepark",
    name: "Havnestads Havnepark",
    area: "Islands Brygge",
    score: 95,
    address: "Islands Brygge 22, 2300 København",
    coordinates: { latitude: 55.665404205576166, longitude: 12.573790195349881 },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/b/bd/Islandsbrygge_waterfront.jpg",
      "http://www.christianshavnernet.dk/Christianshavn/Bryggen/Islands_brygge/IMG_3910.jpg",
    ],
  },
  {
    id: "faelledparken",
    name: "Fælledparken",
    area: "Østerbro",
    score: 94,
    address: "Trianglen, 2100 København",
    coordinates: { latitude: 55.702300779373026, longitude: 12.567884842266832 },
    images: [
      "https://www.kk.dk/sites/default/files/styles/hero_desktop/public/2021-05/F%C3%A6lledparken%201920x552.jpg?itok=nhfv49eP",
      "https://graenseforeningen.dk/sites/graenseforeningen.dk/files/styles/article_width_680/public/2021-08/F%C3%A6lledparken.nu_.jpg?itok=sSZx9ihY",
    ],
  },
  {
    id: "little-mermaid",
    name: "The Little Mermaid",
    area: "Østerbro",
    score: 93,
    address: "Langelinie, 2100 København Ø",
    coordinates: { latitude: 55.69295792626929, longitude: 12.59920029526256 },
    images: [
      "https://usercontent.one/wp/www.rundtidanmark.dk/wp-content/uploads/2021/06/KMO_9949.jpg",
      "https://a.cdn-hotels.com/gdcs/production103/d1630/806328d2-1333-4996-a51b-39d34be73bee.jpg",
    ],
  },
  {
    id: "vor-frue-kirke",
    name: "Vor Frue Kirke",
    area: "Indre By",
    score: 93,
    address: "Nørregade 8, 1165 København",
    coordinates: { latitude: 55.685138307213016, longitude: 12.589543670252091 },
    images: [
      "https://media.lex.dk/media/148242/standard_scanpixId20190412-115426-4",
      "https://media.lex.dk/media/148240/standard_compressed_scanpixId20200612-093400-2",
    ],
  },
  {
    id: "frederiks-kirke",
    name: "Frederiks Kirke (Marmorkirken)",
    area: "Indre By",
    score: 93,
    address: "Frederiksgade 4, 1265 København",
    coordinates: { latitude: 55.67937896150321, longitude: 12.572147968274647 },
    images: [
      "https://a.cdn-hotels.com/gdcs/production179/d681/f13169e0-f7ac-4607-ad20-45c02f4ed486.jpg?impolicy=fcrop&w=800&h=533&q=medium",
      "https://a.cdn-hotels.com/gdcs/production7/d60/ac6ebd76-fb78-4879-af62-9e7e7c9dfe4a.jpg",
    ],
  },
  {
    id: "zoo",
    name: "Zoologisk Have København",
    area: "Frederiksberg",
    score: 55,
    address: "Roskildevej 32, 2000 Frederiksberg",
    coordinates: { latitude: 55.67253027778619, longitude: 12.521315181767763 },
    images: [
      "https://www.sciencestories.dk/sites/default/files/styles/large/public/2020-06/Zoo%20test_0.jpg?h=5c7d85c7&itok=IOQvi9CF",
      "https://cdn.lorry.bazo.dk/images/eca5231d-2e72-4c9d-a1ff-83eb9025621a/d/4-3/s/2048",
    ],
  },
  {
    id: "national-museum",
    name: "National Museum of Denmark",
    area: "Indre By",
    score: 50,
    address: "Ny Vestergade 10, 1471 København K",
    coordinates: { latitude: 55.67457812197257, longitude: 12.574676383616369 },
    images: [
      "https://media.lex.dk/media/4497/standard_Nationalmuseet.jpg",
      "https://files.guidedanmark.org/files/382/172945_Nationalmuseet.jpg",
    ],
  },
  {
    id: "den-blaa-planet",
    name: "Den Blå Planet",
    area: "Kastrup",
    score: 20,
    address: "Jacob Fortlingsvej 1, 2770 Kastrup",
    coordinates: { latitude: 55.638610148608976, longitude: 12.655649397107624 },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/b/ba/Den_Bl%C3%A5_Planet_%28Kastrup%29.JPG",
      "https://denblaaplanet.dk/wp-content/uploads/2020/08/oceantunnel-scaled.jpg",
    ],
  },
  {
    id: "tivoli",
    name: "Tivoli",
    area: "Indre By",
    score: 15,
    address: "Vesterbrogade 3, 1630 København V",
    coordinates: { latitude: 55.6738352545145, longitude: 12.568286556922459 },
    images: [
      "https://files.guidedanmark.org/files/382/382_8363.jpg",
      "https://cdn.getyourguide.com/img/tour/deb003da0074a486.jpeg/99.jpg",
    ],
  },
];

// band is derived, never typed by hand. pin is the badge colour on the map.
export const ATTRACTIONS = RAW.map((a) => {
  const band = bandFor(a.score);
  return { ...a, band: band.key, pin: band.color };
});

// Highest score first. Ties keep the order above, which is the 2023 ranking.
export const RANKED = [...ATTRACTIONS].sort((a, b) => b.score - a.score);

export const getAttraction = (id) => ATTRACTIONS.find((a) => a.id === id);

// Stacking order where map pins overlap in the city centre. Red sits above
// amber, which sits above green, so the places worth avoiding stay visible.
// Within a band the higher score sits on top, so the best place in a cluster
// (Kastellet over The Little Mermaid) is the one you can tap.
const BAND_LAYER = { low: 0, medium: 1, high: 2 };
export const pinOrder = (a) => BAND_LAYER[a.band] * 1000 + a.score;

export const directionsUrl = ({ coordinates: { latitude, longitude } }) =>
  `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
