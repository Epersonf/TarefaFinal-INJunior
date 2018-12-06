var express = require('express');
var router = express.Router();
var Order = require('../../models/encomenda');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let order = req.body;
        try{
            let newOrder = await Order.create(order); 
            /* req.order = newOrder;
            console.log('API: ', order);
            next();  */
            res.status(200).json(newOrder);
        } 
        catch (error) {
            res.status(404).json({error});
        }        
    })
    //retrieve
    .get(async (req, res) => {
        let { id } = req.query;
        if (id) {
            let order = await Order.findById(id);
            res.json(order);
        } else {
            let orders = await Order.find({}).exec();
            res.json(orders);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let order = req.body;
        if (id) {
            try{
                let newOrder = await Order.updateOne({'_id': id}, {'$set': order});
                res.json(newOrder);
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
                let remove = await Order.deleteOne({'_id': id});
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