var express = require('express');
var router = express.Router();
var Notification = require('../../models/notification');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let notification = req.body;
        try{
            let newNotification = await Notification.create(notification); 
            req.notification = newNotification;
            console.log('API: ', notification);
            next(); 
            //res.status(200).json(notification);
        } 
        catch (error) {
            res.status(404).json({error});
        }        
    })
    //retrieve
    .get(async (req, res) => {
        let { id } = req.query;
        if (id) {
            let notification = await Notification.findById(id);
            res.json(notification);
        } else {
            let notifications = await Notification.find({}).exec();
            res.json(notifications);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let notification = req.body;
        if (id) {
            try{
                let newNotification = await Notification.updateOne({'_id': id}, {'$set': notification});
                res.json(newNotification);
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
                let remove = await Notification.deleteOne({'_id': id});
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