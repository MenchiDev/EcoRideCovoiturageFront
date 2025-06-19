
const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSingin = document.getElementById("btnSignin");
const signinForm = document.getElementById("signinForm");

btnSingin.addEventListener("click", checkCredentials);

function checkCredentials(){
    let dataForm = new FormData(signinForm);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": dataForm.get("email"),
      "password": dataForm.get("password")
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://127.0.0.1:8000/api/login", requestOptions)
      .then(response => { 
        if (response.ok) {
          return response.json();
        }
        else {
            mailInput.classList.add("is-invalid");
            passwordInput.classList.add("is-invalid");
        }

        })
      .then(result => {
        
          const token = result.apiToken;
          setToken(token);
          //placer ce token en cookie
  
          setCookie(RoleCookieName, result.roles[0], 7);
          window.location.replace("/");
    })
      .catch((error) => console.error(error));
}