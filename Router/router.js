// router.js (Modifié)
import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

let homeJsExecuted = false;
const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

const getRouteByUrl = (url) => {
    let currentRoute = null;
    allRoutes.forEach((element) => {
        if (element.url == url) {
            currentRoute = element;
        }
    });
    if (currentRoute != null) {
        return currentRoute;
    } else {
        return route404;
    }
};

const LoadContentPage = async () => {
    console.log("LoadContentPage appelée avec le chemin:", window.location.pathname);
    const path = window.location.pathname;
    const actualRoute = getRouteByUrl(path);

    // ... (votre logique de vérification des droits d'accès existante) ...
    const allRolesArray = actualRoute.authorize;

    if (allRolesArray.length > 0) {
        const isUserDisconnected = allRolesArray.includes("disconnected");

        if (isUserDisconnected && isConnected()) { // Assurez-vous que isConnected() est défini
            window.location.replace("/");
            return; // Important: arrêter ici après redirection
        } else if (!isUserDisconnected) {
            const roleUser = getRole(); // Assurez-vous que getRole() est défini
            if (!allRolesArray.includes(roleUser)) {
                window.location.replace("/");
                return; // Important: arrêter ici après redirection
            }
        }
    }


    // Récupération du contenu HTML de la route
    const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
    // Ajout du contenu HTML à l'élément avec l'ID "main-page"
    document.getElementById("main-page").innerHTML = html;
    console.log("Contenu HTML chargé pour :", actualRoute.pathHtml); // Log pour confirmer le chargement HTML


    // --- NOUVELLE LOGIQUE POUR LE CHARGEMENT JS ET L'APPEL DE FONCTIONS SPÉCIFIQUES ---
    if (actualRoute.pathJS !== "") {
        // Supprimez les anciens scripts du body pour éviter les duplications et les erreurs
        // C'est important si vos scripts contiennent des écouteurs d'événements qui ne seraient pas nettoyés
        // (Bien que votre cas n'ait pas d'écouteur DOMContentLoaded global, c'est une bonne pratique)
        const oldScript = document.querySelector(`script[src="${actualRoute.pathJS}"]`);
        if (oldScript) {
            oldScript.remove();
        }

        let scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "text/javascript");
        scriptTag.setAttribute("src", actualRoute.pathJS);
        scriptTag.defer = true; // Défer le script pour qu'il ne bloque pas le parsing HTML

        scriptTag.onload = () => {
            console.log("Script chargé et exécuté :", actualRoute.pathJS);

            // LOGIQUE SPÉCIFIQUE POUR LA PAGE DE DÉTAILS
            if (actualRoute.url === "/details") {
                const urlParams = new URLSearchParams(window.location.search);
                const carpoolId = urlParams.get("id");
                console.log("Router: Tentative d'appel à fetchCarpoolDetailsAndDisplay pour ID:", carpoolId);

                // Vérifiez que la fonction globale existe AVANT de l'appeler
                if (carpoolId && typeof window.fetchCarpoolDetailsAndDisplay === "function") {
                    window.fetchCarpoolDetailsAndDisplay(carpoolId);
                } else if (!carpoolId) {
                    console.error("Router: Aucun ID de trajet trouvé pour la page de détails.");
                    // Afficher un message d'erreur si l'ID est manquant
                    const detailsContainer = document.getElementById("carpool-details");
                    if(detailsContainer) { // S'assurer que le conteneur existe avant de le manipuler
                        detailsContainer.innerHTML = `
                            <div class="alert alert-danger">Aucun identifiant de trajet fourni dans l'URL pour la page de détails.</div>
                        `;
                    } else {
                         document.getElementById("main-page").innerHTML = `
                            <div class="alert alert-danger">Aucun identifiant de trajet fourni OU conteneur de détails introuvable.</div>
                        `;
                    }
                } else {
                    console.error("Router: La fonction fetchCarpoolDetailsAndDisplay n'est pas disponible dans le scope global de la fenêtre.");
                }
            }
            // FIN LOGIQUE SPÉCIFIQUE

            // Logique pour home.js si applicable (garder celle que vous aviez)
            if (actualRoute.pathJS === "/js/home.js") {
                homeJsExecuted = true;
            }
        };

        scriptTag.onerror = (e) => {
            console.error("Erreur lors du chargement du script:", actualRoute.pathJS, e);
        };

        document.body.appendChild(scriptTag);
    }
    // --- FIN NOUVELLE LOGIQUE ---


    // Changement du titre de la page
    document.title = actualRoute.title + " - " + websiteName;

    // Fonction à implémenter pour afficher/masquer des éléments en fonction du rôle
    if (typeof showAndHideElementsForRoles === "function") { // Assurez-vous que cette fonction est globalement accessible
        showAndHideElementsForRoles();
    } else {
        console.warn("La fonction showAndHideElementsForRoles n'est pas définie ou accessible globalement.");
    }
};

// ... (votre gestion des événements de routage et de popstate) ...
// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    LoadContentPage();
};

window.onpopstate = LoadContentPage;
window.route = routeEvent;
LoadContentPage(); // Chargement initial de la page

console.log("Définition de getRouteByUrl et initialisation du routeur...");