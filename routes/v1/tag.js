var express = require('express');
var router = express.Router();
var Tag = require('../../models/tag');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let tag = req.body;
        try {
            let newTag = await Tag.create(tag);
            newTag = await newTag;
            res.status(200).json(newTag);
        }
        catch (err) {
            return next(err);
        }
    })
    //retrieve
    .get(async (req, res) => {
        let { id, sort, skip, limit, ...otherParams } = req.query;
        try {
            if (id) {
                let tag = await Tag.findById(id);
                res.json(tag);
            } else {
                let query = Tag.find(otherParams);
                sort ?
                    query = query.sort(sort) :
                    null;
                limit ?
                    query = query.limit(Number(limit)) :
                    null;
                skip ?
                    query = query.limit(Number(skip)) :
                    null
                let orders = await query.exec();
                res.json(orders);
            }
        } catch (err) {
            return next(err);
        }
    })
    //update
    //delete
    .delete(async (req, res) => {
        let { id } = req.query;
        if (id) {
            try {
                let remove = await Tag.deleteOne({ '_id': id });
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