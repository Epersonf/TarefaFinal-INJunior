const express = require('express');
const router = express.Router();
const Order = require('../../models/encomenda');
const frete = require('frete');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let order = req.body;
        try {
            let newOrder = await Order.create(order);
            /* req.order = newOrder;
            console.log('API: ', order);
            next();  */
            newOrder = await newOrder.populate({ 'path': 'pagamento' }).execPopulate();
            res.status(200).json(newOrder);
        }
        catch (error) {
            res.status(404).json({ error });
        }
    })
    //retrieve
    .get(async (req, res) => {
        let { id, sort, skip, limit, ...otherParams } = req.query;
        if (id) {
            let order = await Order.findById(id);
            res.json(order);
        } else {
            let query = Order.find(otherParams)
                .populate(
                    {
                        'path': 'donoId',
                        'select': '_id nome sobrenome whatsapp endereco cidade cep cpf'
                    })
                .populate(
                    {
                        'path': 'pagamento'
                    });
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
    .put(async (req, res) => {
        let { id } = req.query;
        let order = req.body;
        if (id) {
            try {
                let newOrder = await Order.updateOne({ '_id': id }, { '$set': order });
                res.json(newOrder);
            }
            catch (error) {
                res.status(404).json({ error });
            }

        } else {
            res.status(400).json({ error: 'Missing ID' });
        }
    })
    //delete
    .delete(async (req, res) => {
        let { id } = req.query;
        if (id) {
            try {
                let remove = await Order.deleteOne({ '_id': id });
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

router.route('/shippMentPrice')
    .post(async (req, res, next) => {
        let { cep, value } = req.body;
        frete()
            .cepOrigem('36204632')
            .peso(1)
            .formato(1)
            .comprimento(16)
            .altura(2)
            .largura(11)
            .diametro(1)
            .maoPropria('N')
            .valorDeclarado(value)
            .avisoRecebimento('S')
            .servico(frete.codigos.pac)
            .preco(cep, function (err, results) {
                if(results.erro){
                    res.status(400).json({ msg: results.msgErro });
                }
                res.json(results);
            });
    })

module.exports = router;