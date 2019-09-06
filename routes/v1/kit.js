var express = require('express');
var router = express.Router();
var Kit = require('../../models/kit');

router.route('/')
    //create
    .post(async (req, res, next) => {
        const kit = req.body;
        try {
            const newKit = await Kit.create(kit);
            res.status(200).json(newKit);
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
                let kit = await Kit.findById(id);
                res.json(kit);
            } else {
                let kits = await Kit.find({}).exec();
                res.json(kits);
            }
        }
        catch (err) {
            return next(err);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let kit = req.body;
        if (id) {
            try {
                let newKit = await Kit.updateOne({ '_id': id }, { '$set': kit });
                res.json(newKit);
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
                let remove = await Kit.deleteOne({ '_id': id });
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