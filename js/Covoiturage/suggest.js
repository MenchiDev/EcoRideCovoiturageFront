window.initSuggestScript = function () {
    console.log("Script suggest.js chargé ✔");

    const tripForm = document.getElementById("tripForm");
    const carSelect = document.getElementById("carSelect");
    const apiToken = getCookie("accesstoken");
    const creditCountSpan = document.getElementById("credit-count"); // Récupération de l'élément pour afficher les crédits
    let currentVehicles = [];
    const carpoolUrl = "http://127.0.0.1:8000/api/carpool/new"; // URL de votre API pour ajouter un trajet


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    }

    function displayVehicles(vehicles) {
        carSelect.innerHTML = '<option value="">Sélectionner un véhicule</option>';
        vehicles.forEach(vehicle => {
            const option = document.createElement("option");
            option.value = vehicle.id; // Utiliser l'ID de la voiture, pas l'immatriculation
            const brand = vehicle.brand?.label || "Marque inconnue";
            const model = vehicle.model || "Modèle inconnu";
            const reg = vehicle.registrationNumber || ""; // Garder l'immatriculation pour l'affichage
            option.textContent = `${brand} ${model} - ${reg}`;
            carSelect.appendChild(option);
        });
    }

    async function fetchUserVehicles() {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/car", {
                headers: {
                    "Authorization": apiToken,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.error("Erreur API véhicules:", response.status);
                return;
            }

            const contentType = response.headers.get("content-type");
            if (!contentType?.includes("application/json")) {
                console.error("Réponse non-JSON.");
                return;
            }

            const data = await response.json();
            currentVehicles = data;
           
            displayVehicles(data);
        } catch (err) {
            console.error("Erreur réseau:", err);
        }
    }

    async function fetchUserCredits() {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/credits", { // Assurez-vous que cette URL est correcte
                headers: {
                    "Authorization": apiToken,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.error("Erreur API crédits:", response.status);
                return;
            }
            const data = await response.json();
             if (creditCountSpan) {
                creditCountSpan.textContent = data.credits; // Mettre à jour l'affichage des crédits
             }

        } catch (error) {
            console.error("Erreur lors de la récupération des crédits:", error);
        }
    }


    async function submitTripForm(event) {
        event.preventDefault();

        const carId = carSelect.value;
        const departureLocation = document.getElementById("departure").value;
        const arrivalLocation = document.getElementById("destination").value;
        const dateTimeInput = document.getElementById("dateTime").value;
        const arrivalDateTimeInput = document.getElementById("arrivalDateTime").value;
        const price = document.getElementById("price").value;
        const seats = document.getElementById("seats").value;
        const ecoTrip = document.getElementById("ecoTrip").checked;
        const status = "prévu"; // Vous pouvez définir un statut par défaut

        if (!carId) {
            alert("Veuillez sélectionner une voiture.");
            return;
        }

        const departureDate = dateTimeInput.split("T")[0];
        const departureTime = dateTimeInput.split("T")[1];
        const arrivalDate = arrivalDateTimeInput.split("T")[0];
        const arrivalTime = arrivalDateTimeInput.split("T")[1];


        const tripData = {
            car_id: parseInt(carId), // Important : envoyer l'ID de la voiture
            departureDate: departureDate,
            departureTime: departureTime,
            departureLocation: departureLocation,
            arrivalDate: arrivalDate,
            arrivalTime: arrivalTime,
            arrivalLocation: arrivalLocation,
            status: status,
            availableSeats: parseInt(seats),
            price: parseFloat(price)
        };

        try {
            const response = await fetch(carpoolUrl, {
                method: "POST",
                headers: {
                    "Authorization": apiToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tripData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erreur lors de la création du trajet:", errorData);
                alert("Erreur lors de la création du trajet: " + (errorData.message || "Erreur inconnue"));
                return;
            }

            const responseData = await response.json();
            console.log("Trajet créé avec succès:", responseData);
            alert("Trajet créé avec succès !");
            fetchUserCredits(); // Mettre à jour les crédits après la création du trajet
            tripForm.reset(); // Réinitialiser le formulaire
        } catch (error) {
            console.error("Erreur réseau:", error);
            alert("Erreur réseau: " + error.message);
        }
    }

    // Initialisation
   
        fetchUserVehicles();
    
    fetchUserCredits(); // Récupérer et afficher les crédits au chargement de la page

    tripForm.addEventListener("submit", submitTripForm);
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.initSuggestScript);
} else {
    window.initSuggestScript();
}
