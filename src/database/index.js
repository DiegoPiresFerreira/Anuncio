const Sequelize = require('sequelize')


// criando banco de dados
const connection = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
})

module.exports = connection