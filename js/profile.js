// Initialisation du script une fois le DOM chargé
window.initProfileScript = function () {
    console.log("✅ Script profile.js chargé");

    // ======= DOM Elements =======
    const roleSelect = document.getElementById("role");
    const vehiculeSection = document.getElementById("vehicule-section");
    const publishBtn = document.getElementById("publish-btn");
    const creditInfo = document.getElementById("credit-info-section");
    const addVehiculeBtn = document.getElementById("add-vehicule-btn");
    const addVehiculeSection = document.getElementById("add-vehicule-section");
    const cancelVehiculeBtn = document.getElementById("cancel-vehicule-btn");
    const saveVehiculeBtn = document.getElementById("save-vehicule-btn");
    const vehiculeSelect = document.getElementById("vehicule");
    const immatriculationError = document.getElementById("immatriculation-error");
    const vehiculeDetails = document.getElementById("vehicule-details");
    const publicationHistory = document.getElementById("publication-history");

    // ======= Variables =======
    let currentVehicles = [];

    // ======= Utils =======

    // Récupère le token d'authentification depuis les cookies
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    }

    const apiToken = getCookie('accesstoken');

    // ======= API Calls =======

    // Récupère la liste des véhicules de l'utilisateur
    async function fetchUserVehicles() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/car', {
                headers: {
                    'Authorization': apiToken,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) displayVehicles([]);
                return;
            }

            const data = await response.json();
            currentVehicles = data;
            displayVehicles(data);
        } catch (error) {
            console.error("❌ Erreur lors du fetch des véhicules:", error);
        }
    }

    // Récupère les trajets publiés par l'utilisateur
    async function fetchUserPublishedTrips() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/carpool/my', {
                headers: {
                    'Authorization': apiToken,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error("❌ Erreur lors de la récupération des trajets.");
                return;
            }

            const data = await response.json();
            displayPublishedTrips(data);
        } catch (error) {
            console.error("❌ Erreur réseau lors du fetch des trajets publiés:", error);
        }
    }

    // Ajoute un nouveau véhicule
    async function addNewVehicle(vehicleData) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/car/new', {
                method: 'POST',
                headers: {
                    'Authorization': apiToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehicleData),
            });

            const responseText = await response.text();

            if (response.ok) {
                immatriculationError.classList.add("d-none");
                await fetchUserVehicles();
                resetVehiculeForm();
                addVehiculeSection.classList.add("d-none");
                vehiculeSection.style.display = "block";
                publishBtn.disabled = false;
            } else {
                if (response.status === 409 && responseText.includes("existe déjà")) {
                    immatriculationError.classList.remove("d-none");
                } else {
                    console.error("❌ Erreur API:", response.status, responseText);
                }
            }
        } catch (error) {
            console.error("❌ Erreur réseau lors de l'ajout du véhicule:", error);
        }
    }

    // ======= UI Display Functions =======

    // Affiche la liste des véhicules dans le select
    function displayVehicles(vehicles) {
        vehiculeSelect.innerHTML = '<option value="">Sélectionner un véhicule</option>';

        vehicles.forEach(vehicle => {
            const option = document.createElement("option");
            const brand = vehicle.brand?.label || "Marque inconnue";
            const model = vehicle.model || "Modèle inconnu";
            const reg = vehicle.registrationNumber || "";

            option.value = reg;
            option.textContent = `${brand} ${model} - ${reg}`;
            vehiculeSelect.appendChild(option);
        });
    }

    // Affiche la liste des trajets publiés par l'utilisateur
    
    function displayPublishedTrips(trips) {
        publicationHistory.innerHTML = trips.length === 0
            ? '<li class="list-group-item text-muted">Aucun trajet publié.</li>'
            : '';
    
        trips.forEach(trip => {
            const tripItem = document.createElement("li");
            tripItem.classList.add("list-group-item");
    
            // Formatage des dates (jour/mois/année)
            const departureDate = new Date(trip.departureDate).toLocaleDateString('fr-FR');
            const arrivalDate = new Date(trip.arrivalDate).toLocaleDateString('fr-FR');
    
            // Extraire HH:mm depuis "1970-01-01T23:31"
            const formatTimeFromISO = (isoStr) => {
                if (!isoStr) return '';
                const match = isoStr.match(/T(\d{2}:\d{2})/);
                return match ? match[1] : '';
            };
    
            const departureTime = formatTimeFromISO(trip.departureTime);
            const arrivalTime = formatTimeFromISO(trip.arrivalTime);
    
            tripItem.innerHTML = `
                <strong>${trip.departureLocation} → ${trip.arrivalLocation}</strong><br>
                <span>Départ : ${departureDate} à ${departureTime}</span><br>
                <span>Arrivée : ${arrivalDate} à ${arrivalTime}</span><br>
                <small>Places restantes : ${trip.availableSeats}</small>
            `;
    
            publicationHistory.appendChild(tripItem);
        });
    }
    

    // Réinitialise le formulaire d'ajout de véhicule
    function resetVehiculeForm() {
        document.getElementById("vehicule-marque").value = "";
        document.getElementById("vehicule-modele").value = "";
        document.getElementById("vehicule-immatriculation").value = "";
        document.getElementById("vehicule-couleur").value = "";
        immatriculationError.classList.add("d-none");
    }

    // ======= Event Listeners =======

    // Affiche les détails du véhicule sélectionné
    vehiculeSelect.addEventListener("change", () => {
        const selected = currentVehicles.find(v => v.registrationNumber === vehiculeSelect.value);

        if (selected) {
            vehiculeDetails.innerHTML = `
                <strong>Marque:</strong> ${selected.brand?.label || "Inconnue"}<br>
                <strong>Modèle:</strong> ${selected.model || "Inconnu"}<br>
                <strong>Immatriculation:</strong> ${selected.registrationNumber}<br>
                <strong>Couleur:</strong> ${selected.color || "Non précisé"}
            `;
            vehiculeDetails.classList.remove("d-none");
        } else {
            vehiculeDetails.innerHTML = "";
            vehiculeDetails.classList.add("d-none");
        }
    });

    // Affiche les champs pour ajouter un véhicule selon le rôle
    roleSelect.addEventListener("change", () => {
        const role = roleSelect.value;

        vehiculeSection.style.display = (role === "chauffeur" || role === "chauffeur-passager") ? "block" : "none";
        creditInfo.style.display = (role === "chauffeur" || role === "chauffeur-passager") ? "block" : "none";
        publishBtn.disabled = role === "";
    });

    // Affiche le formulaire d'ajout de véhicule
    addVehiculeBtn.addEventListener("click", () => {
        addVehiculeSection.classList.remove("d-none");
        vehiculeSection.style.display = "none";
        publishBtn.disabled = true;
    });

    // Annule l'ajout de véhicule
    cancelVehiculeBtn.addEventListener("click", () => {
        resetVehiculeForm();
        addVehiculeSection.classList.add("d-none");
        vehiculeSection.style.display = "block";
        publishBtn.disabled = false;
    });

    // Enregistre un nouveau véhicule
    saveVehiculeBtn.addEventListener("click", () => {
        const newVehicule = {
            registrationNumber: document.getElementById("vehicule-immatriculation").value.trim().toUpperCase(),
            brand: { label: document.getElementById("vehicule-marque").value.trim() },
            model: document.getElementById("vehicule-modele").value.trim(),
            color: document.getElementById("vehicule-couleur").value.trim(),
            fueltype: '', // champ vide si non utilisé
        };
        addNewVehicle(newVehicule);
    });

    // ======= Initialisation =======
    fetchUserVehicles();
    fetchUserPublishedTrips();
};

// Lancement du script au bon moment
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initProfileScript);
} else {
    window.initProfileScript();
}
