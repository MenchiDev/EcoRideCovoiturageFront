// Sélection des éléments du DOM
const participateBtn = document.getElementById('participateBtn');
const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
const creditAmountDisplay = document.getElementById('creditAmountDisplay');
const creditAmount = document.getElementById('creditAmount');
const seatsRemainingDisplay = document.getElementById('seatsRemainingDisplay');
const tripDetails = document.querySelector('.card-body'); // Sélectionne la div contenant les détails du voyage

// un utilisateur disconnected ne peut pas résérvé un trajet
participateBtn.addEventListener("click", accesse);

// Variables pour stocker les données (simulées pour l'exemple)
let seatsRemaining = parseInt(seatsRemainingDisplay.textContent);
let creditBalance = parseInt(creditAmountDisplay.textContent);
let tripPrice = 25; // Prix du voyage (à récupérer depuis les données réelles)

// Fonction appelée lors du clic sur le bouton "Réserver"
function checkParticipation() {
    if (creditBalance >= tripPrice && seatsRemaining > 0) {
        creditAmount.textContent = tripPrice; // Montant à débiter
        confirmationModal.show();
    } else if (seatsRemaining === 0) {
        displayMessage("Ce voyage est complet.", "danger");
    } else {
        displayMessage("Vous n'avez pas assez de crédits pour ce voyage.", "danger");
    }
}

// Fonction appelée lors du clic sur le bouton "Confirmer" dans le modal
function confirmParticipation() {
    seatsRemaining--;
    seatsRemainingDisplay.textContent = seatsRemaining;

    creditBalance -= tripPrice; // Décrémente le solde du prix du voyage
    creditAmountDisplay.textContent = creditBalance;

    confirmationModal.hide();

    if (creditBalance === 0 || seatsRemaining === 0) {
        updateButtonState();
    }

    // Envoi des données au serveur (à remplacer par votre code)
    console.log("Participation confirmée. Places restantes:", seatsRemaining, "Crédits restants:", creditBalance);

    displayMessage("Votre réservation est confirmée !", "success");
}

// Fonction pour mettre à jour l'état du bouton "Réserver"
function updateButtonState() {
    if (creditBalance === 0 || seatsRemaining === 0) {
        participateBtn.disabled = true;
        participateBtn.textContent = creditBalance === 0 ? "Plus de crédits" : "Complet";
        participateBtn.classList.remove("btn-success");
        participateBtn.classList.add("btn-danger");
    }
}

// Fonction pour afficher un message (en vert ou en rouge)
function displayMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.classList.add('alert', `alert-${type}`); // Utilisation des classes Bootstrap pour la couleur
    messageDiv.style.marginTop = "10px";
    tripDetails.appendChild(messageDiv); // Ajoute le message à la div des détails du voyage

    setTimeout(() => {
        messageDiv.remove();
    }, 5000); // Le message disparaît après 5 secondes
}

// Au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    updateButtonState(); // Met à jour l'état du bouton au chargement
});