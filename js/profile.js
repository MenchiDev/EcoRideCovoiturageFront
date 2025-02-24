// ==============================
// 1️⃣ Sélection des éléments HTML
// ==============================
const roleSelect = document.getElementById("role");
const vehiculeSection = document.getElementById("vehicule-section");
const creditInfoSection = document.getElementById("credit-info-section");
const vehiculeSelect = document.getElementById("vehicule");
const addVehiculeBtn = document.getElementById("add-vehicule-btn");
const addVehiculeSection = document.getElementById("add-vehicule-section");
const vehiculeMarque = document.getElementById("vehicule-marque");
const vehiculeModele = document.getElementById("vehicule-modele");
const vehiculeImmatriculation = document.getElementById("vehicule-immatriculation");
const vehiculeDate = document.getElementById("vehicule-date");
const vehiculeCouleur = document.getElementById("vehicule-couleur");
const publishBtn = document.getElementById("publish-btn");

// Sélection des éléments pour l'historique
const reservationHistory = document.getElementById("reservation-history");
const publicationHistory = document.getElementById("publication-history");

// ==============================
// 2️⃣ Chargement des données stockées
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    loadSavedRole();  // Charger le rôle enregistré
    loadHistory();    // Charger l'historique des trajets
});

// ==============================
// 3️⃣ Fonction pour charger le rôle enregistré
// ==============================
function loadSavedRole() {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
        roleSelect.value = savedRole;
        updateUIBasedOnRole(savedRole);
    }
}

// ==============================
// 4️⃣ Gestion du changement de rôle
// ==============================
roleSelect.addEventListener("change", () => {
    const role = roleSelect.value;
    
    // Sauvegarde du rôle sélectionné dans localStorage
    localStorage.setItem("userRole", role);

    updateUIBasedOnRole(role);
});

// Fonction qui met à jour l'UI en fonction du rôle choisi
function updateUIBasedOnRole(role) {
    if (role === "chauffeur" || role === "chauffeur-passager") {
        vehiculeSection.style.display = "block";
        creditInfoSection.style.display = "block";
    } else {
        vehiculeSection.style.display = "none";
        creditInfoSection.style.display = "none";
    }

    validateForm(); // Vérifie si le formulaire est valide
}

// ==============================
// 5️⃣ Vérification du formulaire pour activer/désactiver "Publier"
// ==============================
function validateForm() {
    if ((roleSelect.value === "chauffeur" || roleSelect.value === "chauffeur-passager") && vehiculeSelect.value !== "") {
        publishBtn.disabled = false;
    } else {
        publishBtn.disabled = true;
    }
}

// ==============================
// 6️⃣ Gestion de l'ajout d'un véhicule
// ==============================
addVehiculeBtn.addEventListener("click", () => {
    addVehiculeSection.classList.toggle("d-none"); // Affiche ou cache la section d'ajout
});

document.getElementById("save-vehicule-btn").addEventListener("click", () => {
    const marque = vehiculeMarque.value.trim();
    const modele = vehiculeModele.value.trim();
    const immatriculation = vehiculeImmatriculation.value.trim();
    const date = vehiculeDate.value;
    const couleur = vehiculeCouleur.value.trim();

    if (marque && modele && immatriculation && couleur) {
        const newVehicule = `${marque} ${modele} (${immatriculation}, ${date}, ${couleur})`;

        // Ajouter à la liste déroulante
        const option = document.createElement("option");
        option.value = newVehicule;
        option.textContent = newVehicule;
        vehiculeSelect.appendChild(option);
        vehiculeSelect.value = newVehicule;

        // Réinitialisation du formulaire
        vehiculeMarque.value = "";
        vehiculeModele.value = "";
        vehiculeImmatriculation.value = "";
        vehiculeDate.value = "";
        vehiculeCouleur.value = "";
        addVehiculeSection.classList.add("d-none");

        validateForm(); // Vérifie si on peut activer "Publier"
    }
});

document.getElementById("cancel-vehicule-btn").addEventListener("click", () => {
    addVehiculeSection.classList.add("d-none");
});

// ==============================
// 7️⃣ Gestion de l'historique des trajets
// ==============================

// Fonction pour charger l'historique
function loadHistory() {
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    const publications = JSON.parse(localStorage.getItem("publications")) || [];

    // Afficher l'historique des réservations
    reservationHistory.innerHTML = reservations.length 
        ? reservations.map(trajet => `<li class="list-group-item">${trajet}</li>`).join("")
        : '<li class="list-group-item text-muted">Aucune réservation effectuée.</li>';

    // Afficher l'historique des publications
    publicationHistory.innerHTML = publications.length 
        ? publications.map(trajet => `<li class="list-group-item">${trajet}</li>`).join("")
        : '<li class="list-group-item text-muted">Aucun trajet publié.</li>';
}

// Fonction pour ajouter une réservation
function addReservation(trajet) {
    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    reservations.push(trajet);
    localStorage.setItem("reservations", JSON.stringify(reservations));
    loadHistory(); // Met à jour l'affichage
}

// Fonction pour ajouter une publication
function addPublication(trajet) {
    let publications = JSON.parse(localStorage.getItem("publications")) || [];
    publications.push(trajet);
    localStorage.setItem("publications", JSON.stringify(publications));
    loadHistory(); // Met à jour l'affichage
}

// ==============================
// 8️⃣ Gestion du bouton "Publier un trajet"
// ==============================
publishBtn.addEventListener("click", () => {
    const role = roleSelect.value;
    const vehicule = vehiculeSelect.value;

    if (role === "chauffeur" || role === "chauffeur-passager") {
        const trajetInfo = `Trajet publié en tant que ${role} avec le véhicule ${vehicule}`;
        addPublication(trajetInfo);
        alert("Votre trajet a été publié !");
    }
});
