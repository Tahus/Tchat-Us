//Require le module Express.js
const app = require('express')();

//Mise en place serveur HTTP qui va utiliser express
const http = require('http').createServer(app);

//Mise en place de socket.io en lui ajoutant le serveur HTTP en paramètre de démarrage
const io = require('socket.io')(http);

//je crée la route d'accueil
app.get('/', (req, res) => {
   //Je récupére le contenu de mon fichier html 
   res.sendFile(__dirname + '/index.html')
});

//écoute d'événement de connection de socket.io
io.on('connection', (socket) =>{
    console.log('Socket connection OK', socket);
})

//Réponse du serveur http sur le port définit avec un log en callback
http.listen(3001, ()=>{
    console.log("Server http OK!");
} );

