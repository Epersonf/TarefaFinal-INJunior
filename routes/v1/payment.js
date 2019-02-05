var express = require('express');
var router = express.Router();
var Payment = require('../../models/acerto');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let payment = req.body;
        try{
            let newPayment = await Payment.create(payment); 
            /* req.payment = newPayment;
            console.log('API: ', payment);
            next();  */
            res.status(200).json(newPayment);
        } 
        catch (error) {
            res.status(404).json({error});
        }        
    })
    //retrieve
    .get(async (req, res) => {
        let { id, ...otherParams } = req.query;
        if (id) {
            let payment = await Payment.findById(id);
            res.json(payment);
        } else {
            let payments = await Payment.find(otherParams).exec();
            res.json(payments);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let payment = req.body;
        if (id) {
            try{
                let newPayment = await Payment.updateOne({'_id': id}, {'$set': payment});
                res.json(newPayment);
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
                let remove = await Payment.deleteOne({'_id': id});
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