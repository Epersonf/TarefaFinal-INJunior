var express = require('express');
var router = express.Router();
var Pack = require('../../models/pack');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let pack = req.body;
        try{
            let newPack = await Pack.create(pack); 
            /* req.pack = newPack;
            next(); */ 
            res.status(200).json(newPack);
        } 
        catch (error) {
            res.status(404).json({error});
        }        
    })
    //retrieve
    .get(async (req, res) => {
        let { id, filter } = req.query;
        if (id) {
            let pack = await Pack.findById(id);
            res.json(pack);
        } else {
            let packs = await Pack.find(filter).exec();
            res.json(packs);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let pack = req.body;
        if (id) {
            try{
                let newPack = await Pack.updateOne({'_id': id}, {'$set': pack});
                res.json(newPack);
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
                let remove = await Pack.deleteOne({'_id': id});
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