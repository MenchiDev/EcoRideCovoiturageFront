// Sélection des éléments du formulaire
const inputNom = document.getElementById("nom");
const inputEmail = document.getElementById("email");
const inputSujet = document.getElementById("sujet");
const inputMessage = document.getElementById("message");
const btnEnvoyer = document.querySelector("#contactForm button[type='submit']"); // Sélection du bouton "Envoyer"

// Ajout d'un écouteur d'événement sur les champs du formulaire (à chaque frappe de touche)
inputNom.addEventListener("keyup", validateForm);
inputEmail.addEventListener("keyup", validateForm);
inputSujet.addEventListener("keyup", validateForm);
inputMessage.addEventListener("keyup", validateForm);

// Fonction permettant de valider le formulaire
function validateForm() {
    const nomOK = validateRequierd(inputNom);
    const mailOK = validateMail(inputEmail);
    const sujetOK = validateRequierd(inputSujet);
    const messageOK = validateRequierd(inputMessage);

    // Active ou désactive le bouton de validation en fonction de la validité du formulaire
    btnEnvoyer.disabled = !(nomOK && mailOK && sujetOK && messageOK);
}

// Fonction permettant de valider l'email de l'utilisateur
function validateMail(input) {
    // Expression régulière pour valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailUser = input.value;

    if (mailUser.match(emailRegex)) {
        input.classList.add("is-valid"); // Ajoute la classe "is-valid" (vert)
        input.classList.remove("is-invalid"); // Supprime la classe "is-invalid" (rouge)
        return true; // Retourne true si l'email est valide
    } else {
        input.classList.remove("is-valid"); // Supprime la classe "is-valid"
        input.classList.add("is-invalid"); // Ajoute la classe "is-invalid"
        return false; // Retourne false si l'email est invalide
    }
}


// Fonction permettant de valider les champs requis (nom, sujet, message)
function validateRequierd(input) {
    if (input.value.trim() !== "") { // Vérifie si le champ n'est pas vide après avoir supprimé les espaces
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}


// Gestion de la soumission du formulaire (avec validation finale)
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche la soumission par défaut

    if (validateForm()) { // Si le formulaire est valide
        alert("Votre message a été envoyé avec succès !");
        this.reset(); // Réinitialise le formulaire
        btnEnvoyer.disabled = true; // Désactive le bouton après l'envoi
    }
});

// Désactiver le bouton au chargement de la page (pour éviter qu'il soit actif avant la première saisie)
window.addEventListener('DOMContentLoaded', (event) => {
    btnEnvoyer.disabled = true;
});