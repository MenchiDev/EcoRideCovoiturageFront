// Sélection des éléments du formulaire
const form = document.getElementById("tripForm");
const departureInput = document.getElementById("departure");
const destinationInput = document.getElementById("destination");
const dateTimeInput = document.getElementById("dateTime");
const durationHoursInput = document.getElementById("durationHours");
const durationMinutesInput = document.getElementById("durationMinutes");
const priceInput = document.getElementById("price");
const seatsInput = document.getElementById("seats");
const ecoTripInput = document.getElementById("ecoTrip");
const submitButton = document.querySelector("#tripForm button[type='submit']"); // Sélection du bouton de soumission
const successModal = new bootstrap.Modal(document.getElementById('successModal'));

// Ajout d'écouteurs d'événements pour chaque champ (validation en temps réel)
[departureInput, destinationInput, dateTimeInput, durationHoursInput, durationMinutesInput, priceInput, seatsInput].forEach(input => {
    input.addEventListener("input", validateForm); // Utilisation de "input" pour une rétroaction immédiate
});

// Fonction principale de validation du formulaire
function validateForm() {
    const departureOK = validateRequired(departureInput);
    const destinationOK = validateRequired(destinationInput);
    const dateTimeOK = validateRequired(dateTimeInput);
    const durationHoursOK = validateRequired(durationHoursInput);
    const durationMinutesOK = validateRequired(durationMinutesInput);
    const priceOK = validateNumber(priceInput);
    const seatsOK = validateNumber(seatsInput);

    submitButton.disabled = !(departureOK && destinationOK && dateTimeOK && durationHoursOK && durationMinutesOK && priceOK && seatsOK);
}

// Validation des champs requis
function validateRequired(input) {
    return toggleValidationClass(input, input.value.trim() !== "");
}

// Validation des champs numériques (Prix, Places)
function validateNumber(input) {
    const num = Number(input.value);
    return toggleValidationClass(input, !isNaN(num) && num > 0); // Vérification si c'est un nombre valide et supérieur à 0
}

// Fonction pour gérer les classes Bootstrap is-valid / is-invalid
function toggleValidationClass(input, isValid) {
    input.classList.toggle("is-valid", isValid);
    input.classList.toggle("is-invalid", !isValid);
    return isValid;
}

// Gestion de la soumission du formulaire
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Empêcher la soumission par défaut

    validateForm(); // Validation finale avant soumission

    if (submitButton.disabled) {
        return; // Ne pas soumettre si le formulaire est invalide
    }

    // Récupérer les valeurs du formulaire
    const departure = departureInput.value;
    const destination = destinationInput.value;
    const dateTime = dateTimeInput.value;
    const durationHours = durationHoursInput.value;
    const durationMinutes = durationMinutesInput.value;
    const price = priceInput.value;
    const seats = seatsInput.value;
    const ecoTrip = ecoTripInput.checked;

    // Ici, vous pouvez envoyer les données au serveur (fetch, XMLHttpRequest, etc.)
    console.log({ departure, destination, dateTime, durationHours, durationMinutes, price, seats, ecoTrip });

    // Afficher le modal de confirmation
    successModal.show();

    // Réinitialiser le formulaire après la soumission réussie (facultatif)
    form.reset();

    // Supprimer les classes de validation
    [departureInput, destinationInput, dateTimeInput, durationHoursInput, durationMinutesInput, priceInput, seatsInput].forEach(input => {
        input.classList.remove("is-valid", "is-invalid");
    });

    submitButton.disabled = true; // Désactiver le bouton après la soumission
});

// Désactivation du bouton au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    submitButton.disabled = true;
});

// Écouteur d'événement pour fermer le modal (facultatif)
// document.getElementById('successModal').addEventListener('hidden.bs.modal', function () {
//     // Actions à effectuer après la fermeture du modal (par exemple, redirection)
// });