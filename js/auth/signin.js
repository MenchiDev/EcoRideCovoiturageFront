
const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSingin = document.getElementById("btnSignin");

btnSingin.addEventListener("click", checkCredentials);

function checkCredentials(){
//Ici, il faudra appeler l'API pour vérifier les credentials en BDD

    if(mailInput.value == "test@mail.com" && passwordInput.value == "123"){
        //Il faudra récupérer le vrai token
        const token = "lkjsdngfljsqdnglkjsdbglkjqskjgkfjgbqslkfdgbskldfgdfgsdgf";
        setToken(token);
        //placer ce token en cookie

        setCookie(RoleCookieName, "employe", 7);
        window.location.replace("/");
    }
    else{
        mailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
    }
}

/*const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");

btnSignin.addEventListener("click", async (event) => {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire
    await checkCredentials();
});

async function checkCredentials() {
    const email = mailInput.value.trim();
    const password = passwordInput.value.trim();

    // Vérification basique des champs avant d'envoyer la requête
    if (!validateEmail(email)) {
        mailInput.classList.add("is-invalid");
        return;
    } else {
        mailInput.classList.remove("is-invalid");
    }

    if (password.length < 6) {
        passwordInput.classList.add("is-invalid");
        return;
    } else {
        passwordInput.classList.remove("is-invalid");
    }

    try {
        // Simulation d'un appel API pour vérifier les identifiants
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            const token = data.token;
            const role = data.role || "user"; // Récupération du rôle, par défaut "user"

            setToken(token);
            setCookie("user_role", role, 7);

            // Redirection après connexion réussie
            window.location.replace("/");
        } else {
            throw new Error(data.message || "Identifiants incorrects");
        }
    } catch (error) {
        console.error("Erreur de connexion :", error);
        showError("Identifiants incorrects. Veuillez réessayer.");
    }
}

// Fonction pour valider un email avec une regex
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fonction pour afficher un message d'erreur
function showError(message) {
    const errorDiv = document.getElementById("loginError");
    if (!errorDiv) {
        const div = document.createElement("div");
        div.id = "loginError";
        div.className = "alert alert-danger mt-3";
        div.innerText = message;
        btnSignin.parentNode.appendChild(div);
    } else {
        errorDiv.innerText = message;
        errorDiv.style.display = "block";
    }
}

// Fonction pour stocker le token en localStorage
function setToken(token) {
    localStorage.setItem("authToken", token);
}

// Fonction pour stocker un cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; Secure`;
}
*/
