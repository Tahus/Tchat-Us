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

    //Je récupère le nom et le message
    const name = document.querySelector("#name");
    const message = document.querySelector("#message");

    //Je récupère le nom de la room 
    const room = document.querySelector("#tabs li.active").dataset.room;
    //Ajout de la date de la création du message
    const createdAt= new Date();

    //envois de messages via emit (pour emmettre un message)
    socket.emit("chat_message", {
      name: name.value,
      message: message.value,
      room: room,
      createdAt: createdAt

    });

    //j'efface les messages après l'envoies côtè émmeteur
    document.querySelector("#message").value = "";
  });

  //j'écoute de l'évent de réception des messages
  socket.on("received_message", (msg) => {
    publishMessages(msg);
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
            //J'efface le contenu de la zone de message quand je sors de la room
            document.querySelector("#messages").innerHTML = "";

            //Je quitte l'ancienne room sur le dataset de la room qui est active
            //je n'oublie pas de créer leave_room côté index.js 
            socket.emit("leave_room", actif.dataset.room);

            //J'entre dans une nouvelle room
            //dataset.room me permet d'aller chercher data-room dans le fichier html ainsi le nom de la room sur la quelle j'ai clické sera automatiquement envoyé au serveur
            socket.emit("enter_room", this.dataset.room); 
        }
    })
  });

  socket.on("init_messages", msg => {
    let data = JSON.parse(msg.messages);
    if(data != []){
        data.forEach(donnees => {
            publishMessages(donnees);
        })
    }
});

};


function publishMessages(msg) {
    document.querySelector( "#messages").innerHTML += `<p>${msg.name} dit ${msg.message}</p>`;
};
