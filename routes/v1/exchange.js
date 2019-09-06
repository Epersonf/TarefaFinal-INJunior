var express = require('express');
var router = express.Router();
var Exchange = require('../../models/troca');

router.route('/')
    //create
    .post(async (req, res, next) => {
        const exchange = req.body;
        try{
            const newExchange = await Exchange.create(exchange); 
            res.status(200).json(newExchange);
        } 
        catch (err) {
            return next(err);
        }        
    })
    //retrieve
    .get(async (req, res) => {
        const { id } = req.query;
        try{
            if (id) {
                const exchange = await Exchange.findById(id);
                res.json(exchange);
            } else {
                const exchanges = await Exchange.find({}).exec();
                res.json(exchanges);
            }
        } catch (err) {
            return next(err);
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
            catch(err){
                return next(err);
            }
            
        } else {
            const err = new Error('Missing ID');
            err.status = 400;
            return next(err);
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
            catch(err){
                return next(err);
            }
            
        } else {
            const err = new Error('Missing ID');
            err.status = 400;
            return next(err);
        }
    })

module.exports = router;