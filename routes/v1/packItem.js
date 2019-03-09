var express = require('express');
var router = express.Router();
var PackItem = require('../../models/packItem');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let packItem = req.body;
        try{
            let newPackItem = await PackItem.create(packItem); 
            /* req.packItem = newPackItem;
            next(); */ 
            res.status(200).json(newPackItem);
        } 
        catch (error) {
            res.status(404).json({error});
        }        
    })
    //retrieve
    .get(async (req, res) => {
        let { id, filter } = req.query;
        if (id) {
            let packItem = await PackItem.findById(id);
            res.json(packItem);
        } else {
            let packItems = await PackItem.find(filter).exec();
            res.json(packItems);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let packItem = req.body;
        if (id) {
            try{
                let newPackItem = await PackItem.updateOne({'_id': id}, {'$set': packItem});
                res.json(newPackItem);
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
                let remove = await PackItem.deleteOne({'_id': id});
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