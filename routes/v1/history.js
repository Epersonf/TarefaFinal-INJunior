var express = require('express');
var router = express.Router();
var History = require('../../models/historico');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let history = req.body;
        try {
            let newHistory = await History.create(history);
            res.status(200).json(newHistory);
        }
        catch (err) {
            return next(err);
        }
    })
    //retrieve
    .get(async (req, res) => {
        let { id } = req.query;

        try {
            if (id) {
                let history = await History.findById(id);
                res.json(history);
            } else {
                let historys = await History.find({}).exec();
                res.json(historys);
            }
        }
        catch (err) {
            return next(err);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let history = req.body;
        if (id) {
            try {
                let newHistory = await History.updateOne({ '_id': id }, { '$set': history });
                res.json(newHistory);
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
                let remove = await History.deleteOne({ '_id': id });
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

module.exports = router;