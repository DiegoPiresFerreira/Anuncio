const express = require('express')
const router = express.Router()
const adverts = require('../models/adverts')

// rota para cadastro de anuncio
router.post('/advert', async (req, res)=>{
    try{
        let {name,announce,dateStart,dateEnd,valueInvested} =req.body
        dateStart = dataString(dateStart)
        dateEnd = dataString(dateEnd)
        
        const announces = await adverts.create({
            announceName:announce,
            client:name,
            dateStart,
            dateEnd,
            valuePerDay:valueInvested.replace(',','.')
        })
        res.status(200).redirect('/')
    }catch(e){
        res.status(404).send({error:'error deu'})
    }
})

// rota para pesquisar anuncios
router.get('/advert', async(req, res)=>{
    try{
        const client = req.query.cliente
        let advert = null
        let list2 = []
        let date = ''
        let list = []
        
        if (client.indexOf('/') != -1){
             date = client.split('-')
             date[0]= Date.parse(dataString(date[0]))
             date[1]= Date.parse(dataString(date[1]))
        }
        advert = await adverts.findAll()

        advert.forEach(x=>{
            if(x.client == client){
                list2.push(x)
            }else if(Date.parse(x.dateStart) == date[0] && Date.parse(x.dateEnd) == date[1]){
                list2.push(x)
            }
        })

         list2.forEach( z=>{
            list.push({
                name: z.announceName,
                total: valueInvested(z),
                visualizations: report(z).total,
                clicks: report(z).clicks,
                sharings: report(z).sharings
                
            })
        })
        
        
        if(advert.length>0){
            res.render('announce',{data:list})
        }else{
            res.redirect('/adverts')
        }

        
     
        
    }catch(e){
        res.status(400).json({error: 'error'})
    }
     
     
})

// rota da pagina de pesquisa de anuncios
router.get('/adverts',(req, res)=>{
        res.render('adverts')   
})

// função para inverter a data (para cadastrar o banco de dados)
const dataString = (dates) => {
    let data = dates.split('/')
    data = data[1]+'/'+data[0]+'/'+data[2]
    return data
}

// função que calcula a quantidade de cliques e compartilhamentos e visualizações
const report = (obj)=>{

    try{

        let visualizationOrigin = Math.round(valueInvested(obj)*30)
        let visualizationSharing = 0
        let clicks = 0
        let sharings = 0

        if(visualizationOrigin >=8){
            clicks = Math.round(visualizationOrigin /8)
            if(clicks >=6){
                sharings = (Math.ceil(clicks/6)) * 160
            }
        }
        visualizationSharing = sharings
        const total = visualizationSharing + visualizationOrigin
        return {total,clicks,sharings}


    }catch(e){

    }

}

// função que ccalcula o valor investido de acordo com a data inicio e fim
const valueInvested = (obj)=>{
    
    try{   
        let start = new Date(obj.dateStart)
        let end = new Date(obj.dateEnd)
        let value = 0   
        while(start.getDate().toString()!= end.getDate().toString()){
            start.setDate(start.getDate()+1)
            value += obj.valuePerDay
        }
        return value

    }catch(e){
        return {error:'error'}
    }
}



module.exports = router