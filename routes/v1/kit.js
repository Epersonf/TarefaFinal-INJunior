var express = require('express');
var router = express.Router();
var Kit = require('../../models/kit');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let kit = req.body;
        try{
            let newKit = await Kit.create(kit); 
            /* req.kit = newKit;
            console.log('API: ', kit);
            next();  */
            res.status(200).json(kit);
        } 
        catch (error) {
            res.status(404).json({error});
        }        
    })
    //retrieve
    .get(async (req, res) => {
        let { id } = req.query;
        if (id) {
            let kit = await Kit.findById(id);
            res.json(kit);
        } else {
            let kits = await Kit.find({}).exec();
            res.json(kits);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let kit = req.body;
        if (id) {
            try{
                let newKit = await Kit.updateOne({'_id': id}, {'$set': kit});
                res.json(newKit);
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
                let remove = await Kit.deleteOne({'_id': id});
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