// /js/Covoiturage/details.js (Modifié)

// Récupère le token d'authentification depuis les cookies (peut rester global ici)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    const cookieValue = parts.length === 2 ? parts.pop().split(';').shift() : null;
    console.log(`Récupération du cookie '${name}' :`, cookieValue ? "Trouvé" : "Non trouvé ou vide");
    return cookieValue;
}

const apiToken = getCookie('accesstoken');
console.log("Token API utilisé pour les requêtes :", apiToken ? "Présent" : "Absent");

// Rendre cette fonction globale pour qu'elle puisse être appelée par le routeur
// Pour cela, nous allons l'assigner à window
window.fetchCarpoolDetailsAndDisplay = async function(carpoolId) { // <<< RENOMMÉE ET RENDUE GLOBALE
    console.log("Appel de fetchCarpoolDetailsAndDisplay par le routeur avec l'ID:", carpoolId); // Nouveau log
    console.log("URL de l'API carpool :", `http://127.0.0.1:8000/api/carpool/${carpoolId}`);

    // Vérifier si l'élément existe AVANT de tenter de le mettre à jour
    const carpoolDetailsContainer = document.getElementById("carpool-details");
    if (!carpoolDetailsContainer) {
        console.error("Erreur: L'élément #carpool-details n'a pas été trouvé dans le DOM.");
        // Gérer l'erreur, peut-être injecter un message directement dans main-page si nécessaire
        document.getElementById("main-page").innerHTML = `<div class="alert alert-danger">Une erreur s'est produite: le conteneur des détails du trajet est introuvable.</div>`;
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/carpool/${carpoolId}`, {
            method: "GET",
            headers: {
                'Authorization': apiToken,
                "Accept": "application/json",
            },
        });

        console.log("Réponse reçue de l'API carpool. Statut HTTP :", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Erreur HTTP lors de la récupération du trajet : ${response.status} - ${errorText}`);
            carpoolDetailsContainer.innerHTML = `
                <div class="alert alert-danger">Impossible de charger les détails du trajet. Erreur: ${response.status}.</div>
            `;
            return; // Arrêter ici car il y a une erreur
        }

        const carpool = await response.json();
        console.log("Détails du trajet récupérés avec succès :", carpool);
        displayCarpoolDetails(carpool); // Cette fonction utilise carpoolDetailsContainer

        if (carpool.user?.id) {
            console.log("ID utilisateur trouvé pour les avis :", carpool.user.id);
            fetchAvisForUser(carpool.user.id);
        } else {
            console.warn("Aucun ID utilisateur trouvé dans les détails du trajet pour récupérer les avis.");
            document.getElementById("avis-list").innerHTML = `<div class="text-muted">Aucun avis disponible (pas d'utilisateur associé).</div>`;
        }

    } catch (error) {
        console.error("Erreur critique lors du chargement du trajet :", error);
        carpoolDetailsContainer.innerHTML = `
            <div class="alert alert-danger">Erreur inattendue lors du chargement des détails du trajet.</div>
        `;
    }
};

// Les autres fonctions restent inchangées, mais ne sont plus appelées par DOMContentLoaded
// ... (displayCarpoolDetails, fetchAvisForUser, handleReservation) ...
function displayCarpoolDetails(carpool) {
    console.log("Affichage des détails du trajet sur la page.");
    const container = document.getElementById("carpool-details"); // S'assure que l'élément est là
    // ... (votre logique d'affichage)
    container.innerHTML = `
        <div class="card shadow p-4">
            <h3>${carpool.departureLocation} ➡ ${carpool.arrivalLocation}</h3>
            <p>📅 <strong>Date :</strong> ${carpool.departureDate ? new Date(carpool.departureDate).toLocaleDateString('fr-FR') : "N/A"}</p>
            <p>🕓 <strong>Heure de départ :</strong> ${carpool.departureTime ?? "N/A"}</p>
            <p>🕓 <strong>Heure d'arrivée :</strong> ${carpool.arrivalTime ?? "N/A"}</p>
            <p>💰 <strong>Prix :</strong> ${carpool.price} €</p>
            <p>💺 <strong>Places disponibles :</strong> ${carpool.availableSeats}</p>
            <p>🚗 <strong>Voiture :</strong> ${carpool.car?.model || "Inconnu"} | Écologique : ${carpool.car?.isElectric ? "Oui" : "Non"}</p>
          <p>👤 <strong>Conducteur :</strong> 
  ${carpool.user?.nickname ?? "Inconnu"} | 
  ${typeof carpool.user?.averageRating === "number" && !isNaN(carpool.user.averageRating)
    ? `⭐ ${carpool.user.averageRating.toFixed(1)}`
    : "⭐ Non évalué"}</p>
</p>


            <div id="avis-container" class="mt-4">
                <h5>Avis sur le conducteur :</h5>
                <div id="avis-list">Chargement des avis...</div>
            </div>

            <div class="mt-4 d-flex justify-content-between">
                <button class="btn btn-secondary" onclick="history.back()">⬅ Retour</button>
                <button class="btn btn-success" onclick="handleReservation(${carpool.id})">Réserver</button>
            </div>
        </div>
    `;
}

async function fetchAvisForUser(userId) {
    console.log(`Démarrage de la requête pour les avis de l'utilisateur ID: ${userId}`);
    // ... (votre logique fetchAvisForUser) ...
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/reviews`, {
            method: "GET",
            headers: {
                'Authorization': apiToken,
                "Content-Type": "application/json",
            },
        });

        const avisContainer = document.getElementById("avis-list");
        console.log("Réponse reçue de l'API avis. Statut HTTP :", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            avisContainer.innerHTML = `<div class="alert alert-warning">Impossible de charger les avis (Code : ${response.status}).</div>`;
            console.warn(`Erreur API avis: ${response.status} - ${errorText}`);
            return;
        }

        const avisList = await response.json();
        console.log("Avis récupérés avec succès :", avisList);

        if (!avisList.length) {
            avisContainer.innerHTML = `<div class="text-muted">Aucun avis pour ce conducteur.</div>`;
            console.log("Aucun avis trouvé pour ce conducteur.");
            return;
        }

        avisContainer.innerHTML = avisList
            .map((avis) => `
                <div class="border-bottom py-2">
                    <strong>${avis.nickname ?? "Utilisateur"}</strong> :
                    <span>⭐ ${avis.rating}/5</span>
                    <p>${avis.comment ?? "Pas de commentaire."}</p>
                </div>
            `)
            .join("");
        console.log("Avis affichés sur la page.");

    } catch (error) {
        console.error("Erreur lors du chargement des avis :", error);
        document.getElementById("avis-list").innerHTML = `
            <div class="alert alert-danger">Une erreur inattendue est survenue lors du chargement des avis.</div>
        `;
    }
}

function handleReservation(carpoolId) {
    console.log(`Bouton 'Réserver' cliqué pour le trajet ID : ${carpoolId}`);
    alert(`Fonctionnalité de réservation pour le trajet ${carpoolId} à implémenter.`);
}