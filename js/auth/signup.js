//sélecrion des éléments du formulaire
const inputNom = document.getElementById("NomInput");
const inputPrenom = document.getElementById("PrenomInput");
const inputEmail = document.getElementById("EmailInput");
const inputPassword = document.getElementById("PasswordInput");
const inputValidatePassword = document.getElementById("ValidatePasswordInput");
const btnValidate= document.getElementById("btn-validation-inscription");

//ajjout d'un écouteur d'événement sur les champs du formulaire
inputNom.addEventListener("keyup", validateForm);
inputPrenom.addEventListener("keyup", validateForm);
inputEmail.addEventListener("keyup", validateForm);
inputPassword.addEventListener("keyup", validateForm);
inputValidatePassword.addEventListener("keyup", validateForm);

//fonction permettant de valider le formulaire
function validateForm(){
    const nomOK = validateRequierd(inputNom);
    const prenomOK = validateRequierd(inputPrenom);
    const mailOK = validateMail(inputEmail);
    const passwordOK = validatePassword(inputPassword);
    const passwordConfirmOK = validateConfirmationPassword(inputPassword, inputValidatePassword);

    if (nomOK && prenomOK && mailOK && passwordOK && passwordConfirmOK){
        btnValidate.disabled = false;
    }else{
        btnValidate.disabled = true;
    }

}
//function permettant de valider le mail de l'utilisateur
function validateMail(input){
    //Définir mon regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailUser = input.value;
    if(mailUser.match(emailRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}
//function permettant de valider le mot de passe de l'utilisateur 
function validatePassword(input){
    //Définir mon regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const passwordUser = input.value;
    if(passwordUser.match(passwordRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}
// function permettant de valider la confirmation du mot de passe 
function validateConfirmationPassword(inputPwd, inputConfirmPwd){
    if(inputPwd.value == inputConfirmPwd.value){
        inputConfirmPwd.classList.add("is-valid");
        inputConfirmPwd.classList.remove("is-invalid");
        return true;
    }
    else{
        inputConfirmPwd.classList.add("is-invalid");
        inputConfirmPwd.classList.remove("is-valid");
        return false;
    }
}
//function permettant de valider les champs requis ( nom, prénom)
function validateRequierd(input){
 if(input.value != ""){
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
 }
 else{
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
 }
}