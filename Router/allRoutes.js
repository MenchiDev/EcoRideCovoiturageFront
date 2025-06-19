import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html",[],"/js/home-carpool.js"),
    new Route("/covoiturage", "Covoiturage", "/pages/Covoiturage/covoiturage.html",[],"/js/home-carpool.js"),
    new Route("/details", "detailTrajet", "/pages/Covoiturage/details.html",[], "/js/Covoiturage/details.js"),

    new Route("/suggest", "Covoiturage", "/pages/Covoiturage/suggest.html",[], "/js/Covoiturage/suggest.js"),
    new Route("/reservation", "les reservation", "/pages/reservations/reservation.html",["passager"]),
    new Route("/signin", "connexion", "/pages/auth/signin.html", ["disconnected"], "/js/auth/signin.js"),
    new Route("/signup", "inscription", "/pages/auth/signup.html",["disconnected"], "/js/auth/signup.js"),
    new Route("/contact", "contact", "/pages/contact.html",[], "/js/contact.js"),
    new Route("/announcement", "mes annonces", "/pages/announcements/announcement.html", ["conducteur"]),
    new Route("/profile", "mon compte ","/pages/profile.html", ["ROLE_USER"], "/js/profile.js"),
    new Route("/employe", "espace employe", "/pages/employe.html", ["employe"], "/js/employe.js"),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";

