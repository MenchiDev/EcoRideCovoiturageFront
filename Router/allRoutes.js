import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html"),
    new Route("/covoiturage", "Covoiturage", "/pages/Covoiturage/covoiturage.html"),
    new Route("/details", "detailTrajet", "/pages/Covoiturage/details.html"),
    new Route("/suggest", "Covoiturage", "/pages/Covoiturage/suggest.html"),
    new Route("/reservation", "les reservation", "/pages/reservations/reservation.html"),
    new Route("/signin", "connexion", "/pages/auth/signin.html"),
    new Route("/signup", "inscription", "/pages/auth/signup.html", "/js/auth/signup.js"),
    new Route("/account", "monCompte", "/pages/auth/account.html"),
    new Route("/contact", "contact", "/pages/contact.html"),
    new Route("/announcement", "mes annonces", "/pages/announcements/announcement.html"),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";