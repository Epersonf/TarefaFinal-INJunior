var express = require('express');
var router = express.Router();
var Notification = require('../../models/notification');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let notification = req.body;
        try {
            const newNotification = await Notification.create(notification);
            res.status(200).json(newNotification);
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
                let notification = await Notification.findById(id);
                res.json(notification);
            } else {
                let notifications = await Notification.find(otherParams).exec();
                res.json(notifications);
            }
        }
        catch (err) {
            return next(err);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let notification = req.body;
        if (id) {
            try {
                let newNotification = await Notification.updateOne({ '_id': id }, { '$set': notification });
                res.json(newNotification);
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
                let remove = await Notification.deleteOne({ '_id': id });
                res.json(remove);
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

module.exports = router;