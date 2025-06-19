const tokenCookieName = "accesstoken";
const RoleCookieName = "role";
const signoutBtn = document.getElementById("signout-btn");


signoutBtn.addEventListener("click", signout);

function getRole() {
    return getCookie(RoleCookieName);
}

function signout() {
    eraseCookie(tokenCookieName);
    eraseCookie(RoleCookieName);
    window.location.reload();
}

function setToken(token) {
    setCookie(tokenCookieName, token, 7);
}

function getToken() {
    return getCookie(tokenCookieName);
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (const element of ca) {
        let c = element;
        while (c.startsWith(' ')) c = c.substring(1, c.length);
        if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
// Fonction pour vérifier si l'utilisateur est connecté
function isConnected() {
    return !(getToken() == null || getToken == undefined);
}

function showAndHideElementsForRoles() {
    const userConnected = isConnected();
    const role = getRole();

    let allElementsToEdit = document.querySelectorAll('[data-show]');


    allElementsToEdit.forEach(element => {
        switch (element.dataset.show) {
            case 'disconnected':
                if (userConnected) {
                    element.classList.add("d-none");
                }
                break;
            case 'connected':
                if (!userConnected) {
                    element.classList.add("d-none");
                }
                break;
            case 'admin':
                if (!userConnected || role != "admin") {
                    element.classList.add("d-none");
                }
                break;
            case 'employe':
                if (!userConnected || role != "employe") {
                    element.classList.add("d-none");
                }
                break;
            case 'passager':
                if (!userConnected || role != "passager") {
                    element.classList.add("d-none");
                }
                break;
            case 'conducteur':
                if (!userConnected || role != "conducteur") {
                    element.classList.add("d-none");
                }
                break;
        }
    })
}

//fonction pour rediriger un utilisateur non connecter a se connecter pour effectuer une action 
function accesse(event) {
    if (!isConnected()) {
        alert("Veuillez vous connecter ou créer un compte !")
        window.location.replace("signin");
    } else {
        // Si l'utilisateur est connecté, on laisse la redirection normale
        event.preventDefault();
    }
}

