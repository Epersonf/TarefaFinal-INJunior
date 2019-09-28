var express = require('express');
var router = express.Router();
var Payment = require('../../models/acerto');
var User = require('../../models/user');
var pagSeguroHelper = require('../../helpers/pagSeguroHelper');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let { senderHash, ...payment } = req.body;
        let transactionResult, transaction, newPayment;
        const user = await User.findById(payment.userId);
        console.log({payment});
        try {
            if (payment.tipo === 'boleto') {
                transaction = pagSeguroHelper.collectionBoleto(payment, user, senderHash);
            } else if (payment.tipo === 'credito') {
                transaction = pagSeguroHelper.collectionCard(payment, user, senderHash);
            }

            if (transaction) {
                transactionResult = await pagSeguroHelper.newTransaction(transaction);
                console.info({ transactionResult });
                newPayment = await Payment.create({
                    transactionId: transactionResult.code[0],
                    boletoUrl: transactionResult.paymentLink[0],
                    status: 'WaitingForPayment',
                    ...payment
                });
            } else if (payment.tipo === 'Consultor') {
                newPayment = await Payment.create(payment);
            } else {
                throw new Error('Tipo de transação inválido');
            }

            res.status(200).json(newPayment);
        }
        catch (err) {
            return next(err);
        }
    })
    //retrieve
    .get(async (req, res) => {
        let { id, ...otherParams } = req.query;
        try {
            if (id) {
                let payment = await Payment.findById(id);
                res.json(payment);
            } else {
                let payments = await Payment.find(otherParams).exec();
                res.json(payments);
            }
        } catch (err) {
            return next(err);
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
            catch (err) {
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
            try {
                let remove = await Payment.deleteOne({ '_id': id });
                res.json(remove);
            }
            catch (error) {
                console.log('error');
                res.status(404).json(error);
            }

        } else {
            const err = new Error('Missing ID');
            err.status = 400;
            return next(err);
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

