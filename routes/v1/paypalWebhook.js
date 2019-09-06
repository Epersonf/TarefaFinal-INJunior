const express = require('express');
const router = express.Router();
const pagSeguroHelper = require('../../helpers/pagSeguroHelper');
const Payment = require('../../models/acerto');
const User = require('../../models/user');
const Order = require('../../models/encomenda');
const Collection = require('../../models/collection');

const paymentStatusList = {
    "1": "WationgForPayment",
    "3": "Payed",
    "7": "Canceled",
}

router.route('/')
    .post(async (req, res, next) => {
        const { notificationCode } = req.body;
        let pagseguroNotification;
        try {
            pagseguroNotification = await pagSeguroHelper.getNotification(notificationCode);
        } catch (e) {
            res.status(500).json({error: 'Cannot load pagseguroNotification'});
        }

        const transactionId = pagseguroNotification.code[0];
        const paymentStatus = paymentStatusList[pagseguroNotification.status[0]];
        
        try {
            let payment = await Payment.findOne({ transactionId });
            payment.status = paymentStatus;
            payment = await payment.save();/* 
            if(paymentStatus==="Payed"){
                const reseller = User.findById(payment.userId);
                if(reseller.supervisor){
                    const supervisor = User.findById(reseller.supervisor);
                    supervisor.totalVendido += payment.total;
                    supervisor.desconto += supervisor.porcentagem * payment.total;
                    supervisor.save();
                }
            } else  */if(paymentStatus==="Canceled"){
                const order = Order.findOne({pagamento: payment._id});
                const collection = Collection.findById(order.catalog);
                order.status = 'Cancelada';
                order.save();
                collection.products = [...collection.products, ...order.products];
                // TODO: update collectio history
                collection.save();
            }
            //notificar usuário
            const notification = {
                to: pagseguroNotification.reference[0],
                type: 'PaymentUpdate',
                content: paymentStatus
            }
            req.notification = notification;
            next();
        } catch (e) {
            const err = new Error('Cannot update payment');
            err.status = 400;
            return next(err);
        }
        return;
    })

module.exports = router;