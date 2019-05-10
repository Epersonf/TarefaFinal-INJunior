var express = require('express');
var router = express.Router();
var Payment = require('../../models/acerto');
var User = require('../../models/user');
var pagSeguroHelper = require('../../helpers/pagSeguroHelper');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let { senderHash, ...payment } = req.body;
        let transactionResult, transaction;
        const user = await User.findById(payment.userId);
        try {
            switch (payment.tipo) {
                case 'boleto':
                    transaction = pagSeguroHelper.newBoleto(payment, user, senderHash)
                    break;
            }
            transactionResult = await pagSeguroHelper.newTransaction(transaction);
            let newPayment = await Payment.create({
                transactionId: transactionResult.code[0],
                boletoUrl: transactionResult.paymentLink[0],
                status: 'WaitingForPayment',
                ...payment
            });
            res.status(200).json(newPayment);
        }
        catch (error) {
            res.status(404).json({ error });
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
            try {
                let newPayment = await Payment.updateOne({ '_id': id }, { '$set': payment });
                res.json(newPayment);
            }
            catch (error) {
                res.status(404).json({ error });
            }

        } else {
            res.status(400).json({ error: 'Missing ID' });
        }
    })
    //delete
    .delete(async (req, res) => {
        let { id } = req.query;
        if (id) {
            try {
                let remove = await Payment.deleteOne({ '_id': id });
                res.json(remove);
            }
            catch (error) {
                console.log('error');
                res.status(404).json(error);
            }

        } else {
            res.status(400).json({ error: 'Missing ID' });
        }
    })

router.route('/session-id')
    .get(async (req, res) => {
        try {
            const session = await pagSeguroHelper.authenticate();
            res.status(200).json(session);
        }
        catch (error) {
            console.log('error');
            res.status(404).json(error);
        }
    })

module.exports = router;

