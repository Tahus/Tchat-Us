//connexion au serveur socket
const socket = io();

//Je gère l'arrivée d'un nouveau user
socket.on("connect", () => {
  //j'émer un message d'entrée dans la salle
  socket.emit("enter_room", "général");
});

window.onload = () => {
  //J'écoute l'évent submit
  document.querySelector("form").addEventListener("submit", (e) => {
    //J'empêche le rechargement par default
    e.preventDefault();
    const name = document.querySelector("#name");
    const message = document.querySelector("#message");

    //envois de messages via emit (pour emmettre un message)
    socket.emit("chat_message", {
      name: name.value,
      message: message.value,
    });

    //j'efface les messages après l'envoies côtè émmeteur
    document.querySelector("#message").value = "";
  });

  //j'écoute de l'évent de réception des messages
  socket.on("received_message", (msg) => {
    document.querySelector(
      "#messages"
    ).innerHTML += `<p>${msg.name} dit ${msg.message}</p>`;
  });

  //j'écoute le click sur les rooms
  document.querySelectorAll("#tabs li").forEach((tab) => {
    tab.addEventListener("click", function () {  
        //je verifie que l'onglet de la room n'est pas actif
        if(!this.classList.contains("active")) {
            //Je récupère l'élément actuellement actif 
            const actif= document.querySelector("#tabs li.active");
            //Je désactive l'élément actif
            actif.classList.remove("active");
            //j'active l'élément sur lequel je clique
            this.classList.add("active");
        }
    })
  })

  socket.on;
};
