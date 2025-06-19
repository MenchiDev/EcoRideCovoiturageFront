if (typeof waitForElement === 'undefined') {
    const waitForElement = (selector, callback) => {
        const element = document.querySelector(selector);
        if (element) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    };

    async function searchCarpool(departure, destination, date, displayResultsCallback) {
        try {
            const raw = JSON.stringify({
                departureLocation: departure,
                arrivalLocation: destination,
                departureDate: date,
            });

            const response = await fetch("http://127.0.0.1:8000/api/carpool/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: raw,
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Erreur HTTP: ${response.status} - ${errorDetails}`);
            }

            const carpools = await response.json();
            displayResultsCallback(carpools);

        } catch (error) {
            console.error("Erreur API :", error);
            const resultsContainer = document.getElementById("search-results");
            if (resultsContainer) {
                resultsContainer.innerHTML = `<div class="alert alert-danger">Une erreur est survenue.</div>`;
            }
        }
    }

    function displayResults(allCarpools) {
        const resultsContainer = document.getElementById("search-results");
        if (!resultsContainer) return;
        resultsContainer.innerHTML = "";

        const filterBtnContainer = document.getElementById("filter-button-container");

        if (!allCarpools || allCarpools.length === 0) {
            resultsContainer.innerHTML = `<div class="alert alert-warning">Aucun trajet trouvé pour votre recherche.</div>`;
            filterBtnContainer.style.display = "none";
            return;
        }

        filterBtnContainer.style.display = "block";

        const filterModal = document.getElementById('filterModal');
        const maxPriceInput = filterModal.querySelector('input[placeholder="Ex : 50"]');
        const hoursInput = filterModal.querySelector('input[placeholder="Heures"]');
        const minutesInput = filterModal.querySelector('input[placeholder="Minutes"]');
        const minRatingInput = filterModal.querySelector('input[placeholder="Ex : 4.5"]');
        const ecoCheckbox = filterModal.querySelector('#ecologique');
        const filterForm = filterModal.querySelector('form');

        const applyFilters = () => {
            const maxPrice = parseFloat(maxPriceInput.value) || null;
            const maxDuration = (parseInt(hoursInput.value) || 0) * 60 + (parseInt(minutesInput.value) || 0);
            const minRating = parseFloat(minRatingInput.value) || null;
            const isEcological = ecoCheckbox.checked;

            let filtered = [...allCarpools];

            if (maxPrice !== null) filtered = filtered.filter(c => c.price <= maxPrice);
            if (minRating !== null) filtered = filtered.filter(c => c.user?.averageRating >= minRating);
            if (isEcological) filtered = filtered.filter(c => c.car?.isElectric);

            if (maxDuration > 0) {
                filtered = filtered.filter(c => {
                    const [dh, dm] = c.departureTime?.split(":").map(Number) || [0, 0];
                    const [ah, am] = c.arrivalTime?.split(":").map(Number) || [0, 0];
                    const duration = (ah * 60 + am) - (dh * 60 + dm);
                    return duration <= maxDuration;
                });
            }

            renderCarpools(filtered, resultsContainer);
        };

        filterForm.addEventListener('submit', e => {
            e.preventDefault();
            applyFilters();
        });

        renderCarpools(allCarpools, resultsContainer);
    }

    function formatTime(timeStr) {
        if (!timeStr) return "N/A";
        const [h, m] = timeStr.split(":");
        return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    }

    function renderCarpools(carpools, resultsContainer) {
        resultsContainer.innerHTML = "";

        const filterBtnContainer = document.getElementById("filter-button-container");
        filterBtnContainer.style.display = carpools.length > 0 ? "block" : "none";

        if (!carpools.length) {
            resultsContainer.innerHTML = `<div class="alert alert-warning">Aucun trajet trouvé avec ces filtres.</div>`;
            return;
        }

        carpools.forEach(carpool => {
            const cardWrapper = document.createElement("div");
            cardWrapper.className = "col-12 col-md-6 col-lg-4 mb-4 d-flex align-items-stretch";

            const card = document.createElement("div");
            card.className = "card shadow-sm w-100";

            const dateObject = carpool.departureDate ? new Date(carpool.departureDate) : null;
            const formattedDate = dateObject
                ? `${String(dateObject.getDate()).padStart(2, '0')}/${String(dateObject.getMonth() + 1).padStart(2, '0')}/${dateObject.getFullYear()}`
                : 'N/A';

            const formattedDepartureTime = formatTime(carpool.departureTime);
            const formattedArrivalTime = formatTime(carpool.arrivalTime);

            const ratingDisplay = (carpool.user?.averageRating !== null && carpool.user?.averageRating !== undefined)
                ? `⭐ ${carpool.user.averageRating.toFixed(1)}`
                : '⭐';

            card.innerHTML = `
                <div class="card-body d-flex flex-column justify-content-between h-100">
                    <div>
                        <h5 class="card-title">${carpool.departureLocation} ${formattedDepartureTime} ➡ ${carpool.arrivalLocation} ${formattedArrivalTime}</h5>
                        <p class="card-text">
                            📅 Date : ${formattedDate}<br>
                            🚗 Conducteur : ${carpool.user?.nickname ?? "Anonyme"} ${ratingDisplay}<br>
                            💺 Places disponibles : ${carpool.availableSeats}<br>
                            💰 Prix : ${carpool.price} €
                        </p>
                    </div>
                    <div class="mt-auto d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm" onclick="handleDetails(${carpool.id})">
                            Détails
                        </button>
                        <button class="btn btn-success btn-sm" onclick="handleReservation(${carpool.id})">
                            Réserver
                        </button>
                    </div>
                </div>
            `;

            cardWrapper.appendChild(card);
            resultsContainer.appendChild(cardWrapper);
        });
    }

function handleDetails(carpoolId) {
    window.location.href = `/details?id=${carpoolId}`;
}


    function handleReservation(carpoolId) {
        // À implémenter : appel API ou affichage d'un modal
        alert(`Réservation pour le trajet ID ${carpoolId} (fonction à implémenter).`);
    }

    waitForElement("#formHome", () => {
        const form = document.getElementById("formHome");
        const departInput = document.querySelector('input[placeholder="Départ"]');
        const destinationInput = document.querySelector('input[placeholder="Destination"]');
        const dateInput = document.querySelector("#date-input");
        const searchButton = document.querySelector("#searchButton");

        searchButton.addEventListener("click", e => {
            e.preventDefault();
            const departure = departInput.value.trim();
            const destination = destinationInput.value.trim();
            const date = dateInput.value;

            if (!departure || !destination || !date) {
                alert("Veuillez remplir tous les champs.");
                return;
            }

            searchCarpool(departure, destination, date, displayResults);
        });
    });
}
