var express = require('express');
var router = express.Router();
var Log = require('../../models/log');
const Verify = require('../verify');
const userHelper = require('../../helpers/userHelper');

router.route('/')
    /* //create
    .post(async (req, res, next) => {
        let log = req.body;
        try {
            let newLog = await Log.create(log);
            res.status(200).json(newLog);
        }
        catch (err) {
            return next(err);
        }
    }) */
    //retrieve
    .get(async (req, res, next) => {
        const { id, sort, limit, skip, ...otherParams } = req.query;
        Verify.verifyRole(next, req.decoded.type,
            [
                userHelper.roles.admin,
            ]);
        try {
            if (id) {
                const log = await Log.findById(id);
                res.json(log);
            } else {
                let query = Log.find(otherParams);
                sort ?
                    query = query.sort(sort) :
                    null;
                limit ?
                    query = query.limit(Number(limit)) :
                    null;
                skip ?
                    query = query.limit(Number(skip)) :
                    null
                const logs = await query.exec();
                res.json(logs);
            }
        }
        catch (err) {
            return next(err);
        }
    })
/* //update
.put(async (req, res) => {
    let { id } = req.query;
    let log = req.body;
    if (id) {
        try {
            let newLog = await Log.updateOne({ '_id': id }, { '$set': log });
            res.json(newLog);
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
            let remove = await Log.deleteOne({ '_id': id });
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
}) */

module.exports = router;