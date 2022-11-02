
// Require express de cette manière va me permettre de pouvoir récupuérer mes ressources depuis le dossier public
const express= require('express');
app = express();

//Chargement de path (afin de gérer les chemins)
const path = require('path');

//J'autorise le dossier "public"
app.use(express.static(path.join(__dirname, "public")));

//Création server HTTP
const http = require("http").createServer(app);

//Appel de socket.io
const io = require("socket.io")(http);

const Sequelize= require("sequelize");

//Fabrication du chemin vers le fichier sqlite
const dbPath = path.resolve(__dirname, "tchat.sqlite");

//Connection à la bdd
const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: dbPath
});


//Je charge le modèle "tchat"
const tchat = require("./Models/tchat")(sequelize, Sequelize.DataTypes);

//J'effectue le chargement de ma BDD 
tchat.sync();


// Je crée la route /
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//écoute d'évent "connection" de socket.io
io.on("connection", (socket) => {
  console.log("connexion ok");


  //écoute de déconnexion (aucune information ne sera envoyé à une machine déconnectée)
  socket.on("disconnect", () => {
    console.log("déconnexion socket");
  });


  //écoute d'entrée dans les rooms
  socket.on("enter_room", (room) => {
    //J'entre dans la salle en question
    socket.join(room);
    console.log(socket.rooms);

    //J'envoies tous les messages du salon 
    tchat.findAll({
      attributes: ["id", "name", "message", "room", "createdAt"],
      where: {
        room: room
      }
    }).then(list =>{
      socket.emit("init_messages", {messages: JSON.stringify(list)});
    });
  });


  //écoute de sortie des rooms
  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(socket.rooms);
  });


  //gestion du tchat
  socket.on("chat_message", (msg) => {

    //Stockage du message dans la bdd grâce à la méthode create de sequelize
    //qui me permet de créer un objet dans la bdd
    const message = tchat.create({
      name: msg.name,
      message: msg.message,
      room: msg.room,
      createdAt: msg.createdAt
    }).then(() => {
      //Le message est stocké, je le relaie à tous les users dans le salon correspondant
      io.in(msg.room).emit("received_message", msg);

    }).catch (e => {
      console.log("Attention erreur:", e);
    });
 
  });
  //J'écoute le message typing
  socket.on("typing", (msg) => {
    socket.to(msg.room).emit("usertyping", msg);
  })
});

  

//Appeler le server HTTP sur port 3000
http.listen(3000, () => {
  console.log("j'écoute le port 3000");
});
