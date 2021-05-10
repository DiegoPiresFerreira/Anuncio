const express = require('express')
const app = express()



const connection = require('./database/index')
const adverts = require('./models/adverts')
const adverts_controller = require('./controllers/adverts')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.set('view engine','ejs')
app.use(express.static('public'));

connection
.authenticate()
.then(()=>{
    console.log('Banco de dados conectado!')
})


app.use('/',adverts_controller)

app.get('/', (req, res)=>{
    res.render('index')
})

app.listen(8080,()=>{
    console.log('Servidor rodando')
})