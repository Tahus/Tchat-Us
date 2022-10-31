
// Require express de cette manière va me permettre de pouvoir récupuérer mes ressources depuis le dossier public
const express= require('express');
app = express();

//Chargement de path (afin de résoudre les chemins)
const path = require('path');

//J'autorise le dossier "public"
app.use(express.static(path.join(__dirname, "public")));

//Création server HTTP
const http = require("http").createServer(app);

//Appel de socket.io
const io = require("socket.io")(http);

//écoute d'évent "connection" de socket.io
io.on("connection", (socket) => {
  console.log("connexion ok");

  //écoute de déconnexion (aucune information ne sera envoyé à une machine déconnectée)
  socket.on("disconnect", () => {
    console.log("déconnexion socket");
  });

  //gestion du tchat
  socket.on("chat_message", (msg) => {
    //le message sera relayé à tous les users connectés
    io.emit("received_message", msg);
  });
});

//Je crée la route / et je récupére mon fichier html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Appeler le server HTTP sur port 3000
http.listen(3000, () => {
  console.log("j'écoute le port 3000");
});
