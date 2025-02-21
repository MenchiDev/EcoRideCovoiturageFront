//Implémenté le js de ma page
const inputNom = document.getElementById("NomInput");
const inputPrenom = document.getElementById("PrenomInput");
const inputEmail = document.getElementById("EmailInput");
const inputPassword = document.getElementById("PasswordInput");
const inputValidatePassword = document.getElementById("ValidatePasswordInput");


inputNom.addEventListener("keyup", validateForm);
inputPrenom.addEventListener("keyup", validateForm);

function validateForm(){
    validateRequierd(inputNom);
    validateRequierd(inputPrenom);
    

}
function validateRequierd(input){
 if(input.value != ""){
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
 }
 else{
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
 }
}