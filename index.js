//Appel d'express
app=require('express')();

//Création server HTTP
const http = require('http').createServer(app);

//Appel de socket.io
const io = require('socket.io')(http);

//écoute d'évent "connection" de socket.io
io.on('connection',(socket) =>{
    console.log("connexion ok");

    //écoute de déconnexion
    socket.on('disconnect', ()=>{
        console.log("déconnexion socket");
    });

    //gestion du tchat
    socket.on("chat_message", (msg) =>{
        console.log(msg);
    })

});

//Je crée la route / et je récupére mon fichier html
app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/index.html");
});

//Appeler le server HTTP sur port 3000
http.listen(3000, ()=>{
 console.log("j'écoute le port 3000",);
});
