const sequelize = require('sequelize')
const connection = require('../database/index')

// criação da tabela de anuncios no banco de dados
const adverts = connection.define('adverts',{
    announceName:{
        type: sequelize.STRING,
        allowNull: false
    },
    client:{
        type:sequelize.STRING,
        allowNull: false 
    },
    dateStart:{
        type: sequelize.DATE,
        allowNull: false

    },
    dateEnd:{
        type: sequelize.DATE,
        allowNull: false
    },
    valuePerDay:{
        type: sequelize.DOUBLE,
        allowNull: false
    }
})

adverts.sync({force: false})

module.exports = adverts