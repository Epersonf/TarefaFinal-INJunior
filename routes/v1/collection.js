var express = require('express');
var router = express.Router();
var Collection = require('../../models/collection');
var Verify = require('../verify');

router.route('/')
    //create
    .post(Verify.verifyOrdinaryUser, async (req, res, next) => {
        let collection = req.body;
        try {
            let newCollection = await Collection.create(collection);
            newCollection = await newCollection
                .populate('products')
                .populate('tags')
                .execPopulate();
            res.status(200).json(newCollection);
        }
        catch (error) {
            res.status(404).json({ error });
        }
    })
    //retrieve
    .get(async (req, res) => {
        let { id, sort, skip, limit, ...otherParams } = req.query;
        if (id) {
            let collection = await Collection.findById(id)
                .populate('products')
                .populate('tags');
            res.json(collection);
        } else {
            let query = Collection.find(otherParams)
                .populate('products')
                .populate('tags');
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
    })
    //update
    .put(Verify.verifyOrdinaryUser, async (req, res) => {
        let { id } = req.query;
        let collection = req.body;
        if (id) {
            try {
                let newCollection = await Collection.updateOne({ '_id': id }, { '$set': collection });
                res.json(newCollection);
            }
            catch (error) {
                res.status(404).json({ error });
            }

        } else {
            res.status(400).json({ error: 'Missing ID' });
        }
    })
    //delete
    .delete(Verify.verifyOrdinaryUser, async (req, res) => {
        let { id } = req.query;
        if (id) {
            try {
                let remove = await Collection.deleteOne({ '_id': id });
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

module.exports = router;