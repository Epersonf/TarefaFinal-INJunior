var express = require('express');
var router = express.Router();
var Exchange = require('../../models/troca');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let exchange = req.body;
        try{
            let newExchange = await Exchange.create(exchange); 
            /* req.exchange = newExchange;
            next(); */ 
            res.status(200).json(newExchange);
        } 
        catch (error) {
            res.status(404).json({error});
        }        
    })
    //retrieve
    .get(async (req, res) => {
        let { id } = req.query;
        if (id) {
            let exchange = await Exchange.findById(id);
            res.json(exchange);
        } else {
            let exchanges = await Exchange.find({}).exec();
            res.json(exchanges);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let exchange = req.body;
        if (id) {
            try{
                let newExchange = await Exchange.updateOne({'_id': id}, {'$set': exchange});
                res.json(newExchange);
            }
            catch(error){
                res.status(404).json({error});
            }
            
        } else {
            res.status(400).json({ error: 'Missing ID' });
        }
    })
    //delete
    .delete(async (req, res) => {
        let { id } = req.query;
        if (id) {
            try{
                let remove = await Exchange.deleteOne({'_id': id});
                res.json(remove);
            }
            catch(error){
                console.log('error');
                res.status(404).json(error);
            }
            
        } else {
            res.status(400).json({ error: 'Missing ID' });
        }
    })

module.exports = router;