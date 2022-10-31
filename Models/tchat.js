const Sequelize = require("sequelize");




//Je récupère l'instance de sequilize et DataTypes qui permet de connaître le type de données que je veux stocker
module.exports = (sequelize, DataTypes) => {

    //Je définis ma tables et ses champs
    return sequelize.define("tchat", {
        name: Sequelize.STRING,
        message: Sequelize.STRING,
        room: Sequelize.STRING
    })
} 