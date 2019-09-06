var express = require('express');
var router = express.Router();
var Product = require('../../models/product');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let product = req.body;
        try {
            let newProduct = await Product.create(product);
            newProduct = await newProduct
                .populate('tags')
                .execPopulate();
            res.status(200).json(newProduct);
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
                let product = await Product.findById(id);
                res.json(product);
            } else {
                let query = Product.find(otherParams)
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
        } catch (err) {
            return next(err);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let product = req.body;
        if (id) {
            try {
                let newProduct = await Product.updateOne({ '_id': id }, { '$set': product });
                res.json(newProduct);
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
                let remove = await Product.deleteOne({ '_id': id });
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