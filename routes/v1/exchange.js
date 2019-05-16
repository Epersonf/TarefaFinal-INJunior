var express = require('express');
var router = express.Router();
var Exchange = require('../../models/troca');

router.route('/')
    //create
    .post(async (req, res, next) => {
        const exchange = req.body;
        try{
            const newExchange = await Exchange.create(exchange); 
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
        const { id } = req.query;
        if (id) {
            const exchange = await Exchange.findById(id);
            res.json(exchange);
        } else {
            const exchanges = await Exchange.find({}).exec();
            res.json(exchanges);
        }
    })
    //update
    .put(async (req, res) => {
        const { id } = req.query;
        const exchange = req.body;
        if (id) {
            try{
                const newExchange = await Exchange.updateOne({'_id': id}, {'$set': exchange});
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
                //console.log('error');
                res.status(404).json(error);
            }
            
        } else {
            res.status(400).json({ error: 'Missing ID' });
        }
    })

module.exports = router;