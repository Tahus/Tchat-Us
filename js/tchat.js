
//je teste mon submit via un écouteur d'événement
window.onload =() => {
    document.querySelector("form").addEventListener("submit", (e) => {
    //j'empeche le rechargement de la page  
    e.preventDefault();

    console.log("form envoyé ! :D");

    //je récupére mes champs
    const name = document.querySelector("#name");
    const message = document.querySelector("#message");

    console.log(name, message);

    

  })
}