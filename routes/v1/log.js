var express = require('express');
var router = express.Router();
var Log = require('../../models/pecalog');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let log = req.body;
        try{
            let newLog = await Log.create(log); 
            /* req.log = newLog;
            console.log('API: ', log);
            next(); */ 
            res.status(200).json(newLog);
        } 
        catch (error) {
            res.status(404).json({error});
        }        
    })
    //retrieve
    .get(async (req, res) => {
        let { id } = req.query;
        if (id) {
            let log = await Log.findById(id);
            res.json(log);
        } else {
            let logs = await Log.find({}).exec();
            res.json(logs);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let log = req.body;
        if (id) {
            try{
                let newLog = await Log.updateOne({'_id': id}, {'$set': log});
                res.json(newLog);
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
                let remove = await Log.deleteOne({'_id': id});
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