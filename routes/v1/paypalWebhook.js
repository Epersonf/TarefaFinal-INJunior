const express = require('express');
const router = express.Router();
const pagSeguroHelper = require('../../helpers/pagSeguroHelper');
const Payment = require('../../models/acerto');

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
        //atualizar o payment
        try {
            let payment = await Payment.findOne({ transactionId });
            payment.status = paymentStatus;
            payment = await payment.save();
            //notificar usuário
            const notification = {
                to: pagseguroNotification.reference[0],
                type: 'PaymentUpdate',
                content: paymentStatus
            }
            req.notification = notification;
            next();
        } catch (e) {
            res.status(500).json({error: 'Cannot update payment'});
        }
        return;
    })

module.exports = router;