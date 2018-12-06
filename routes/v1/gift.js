var express = require('express');
var router = express.Router();
var Gift = require('../../models/brinde');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let gift = req.body;
        try{
            let newGift = await Gift.create(gift); 
            /* req.gift = newGift;
            console.log('API: ', gift);
            next();  */
            res.status(200).json(newGift);
        } 
        catch (error) {
            res.status(404).json({error});
        }        
    })
    //retrieve
    .get(async (req, res) => {
        let { id } = req.query;
        if (id) {
            let gift = await Gift.findById(id);
            res.json(gift);
        } else {
            let gifts = await Gift.find({}).exec();
            res.json(gifts);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let gift = req.body;
        if (id) {
            try{
                let newGift = await Gift.updateOne({'_id': id}, {'$set': gift});
                res.json(newGift);
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
                let remove = await Gift.deleteOne({'_id': id});
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