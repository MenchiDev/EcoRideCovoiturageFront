import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html",[],"/js/home.js"),
    new Route("/covoiturage", "Covoiturage", "/pages/Covoiturage/covoiturage.html",[],"/js/Covoiturage/covoiturage.js"),
    new Route("/details", "detailTrajet", "/pages/Covoiturage/details.html",[], "/js/Covoiturage/details.js"),
    new Route("/suggest", "Covoiturage", "/pages/Covoiturage/suggest.html",[],"/js/Covoiturage/suggest.js"),
    new Route("/reservation", "les reservation", "/pages/reservations/reservation.html",["client"]),
    new Route("/signin", "connexion", "/pages/auth/signin.html", ["disconnected"], "/js/auth/signin.js"),
    new Route("/signup", "inscription", "/pages/auth/signup.html",["disconnected"], "/js/auth/signup.js"),
    new Route("/account", "monCompte", "/pages/auth/account.html",["admin", "client"]),
    new Route("/contact", "contact", "/pages/contact.html",[], "/js/contact.js"),
    new Route("/announcement", "mes annonces", "/pages/announcements/announcement.html", ["client"]),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";

/* authorize

[] -> Tout le monde peut y accéder

["disconnected"] -> Réserver aux utilisateurs déconnecté 

["client"] -> Réserver aux utilisateurs avec le rôle client 

["admin"] -> Réserver aux utilisateurs avec le rôle admin 

["admin", "client"] -> Réserver aux utilisateurs avec le rôle client OU admin
*/