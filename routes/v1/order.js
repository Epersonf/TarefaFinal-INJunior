const express = require('express');
const router = express.Router();
const Order = require('../../models/encomenda');
const Collection = require('../../models/collection');
const Payment = require('../../models/acerto');
const ArrayHelper = require('../../helpers/arrayHelper');
const PagseguroHelper = require('../../helpers/pagSeguroHelper');
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
            let order = await Order.findById(id)
                .populate(
                    {
                        'path': 'donoId',
                        'select': '_id nome sobrenome whatsapp endereco cidade cep cpf estoque'
                    })
                .populate(
                    {
                        'path': 'products'
                    });
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
                if (results.erro) {
                    res.status(400).json({ msg: results.msgErro });
                }
                res.json(results);
            });
    })

router.route('/orderFromCollection')
    .post(async (req, res, next) => {
        console.log('body', req.body);
        const { collectionId, costumer, products, values, senderHash } = req.body;
        try {
            let collection = await Collection.findById(collectionId);
            const collectionProducts = collection.toJSON().products;
            const removalResult = ArrayHelper.removeFromArray(collectionProducts.map(c => `${c}`), products);
            if (removalResult.status === 'done') {
                collection.products = removalResult.items;
                const transaction = PagseguroHelper.collectionBoleto(values, costumer, senderHash);
                console.log({transaction});
                const transactionResult = await PagseguroHelper.newTransaction(transaction);
                console.log({transactionResult});
                const payment = await Payment.create({
                    transactionId: transactionResult.code[0],
                    boletoUrl: transactionResult.paymentLink[0],
                    status: 'WaitingForPayment',
                    userNome: costumer.nome,
                    userId: costumer._id,
                    tipo: 'Reseller',
                    valor: values.products,
                    frete: values.shipment,
                    total: values.total,
                });
                await Order.create({
                    item: collection.name,
                    tipo: 'catalogo',
                    donoNome: costumer.nome,
                    donoId: costumer._id,
                    pagamento: payment._id,
                    products,
                })
                await collection.save();
                res.status(200).json({
                    collection,
                });
            }
            res.status(400).json({
                error: 'Peças não encontradas',
            });
        } catch (error) {
            res.status(500).json({ error });
        }
    })

module.exports = router;