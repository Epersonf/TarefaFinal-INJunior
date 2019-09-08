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
        const order = req.body;
        try {
            let newOrder = await Order.create(order);
            newOrder = await newOrder.populate({ 'path': 'pagamento' }).execPopulate();
            res.status(200).json(newOrder);
        }
        catch (err) {
            return next(err);
        }
    })
    //retrieve
    .get(async (req, res) => {
        const { id, sort, skip, limit, ...otherParams } = req.query;
        try {
            if (id) {
                const order = await Order.findById(id)
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
                const orders = await query.exec();
                res.json(orders);
            }
        }
        catch (err) {
            return next(err);
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
                let remove = await Order.deleteOne({ '_id': id });
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
                // TODO: verify error model
                if (results.erro) {
                    return next(results.erro);
                }
                res.json(results);
            });
    })

router.route('/orderFromCollection')
    .post(async (req, res, next) => {
        const { collectionId, costumer, products, values, senderHash, type } = req.body;
        try {
            let collection = await Collection.findById(collectionId);
            const collectionProducts = collection.toJSON().products;
            const removalResult = ArrayHelper.removeFromArray(collectionProducts.map(c => `${c}`), products);
            if (removalResult.status === 'done') {
                collection.products = removalResult.items;
                let transaction;
                if (type === 'boleto') {
                    transaction = PagseguroHelper.collectionBoleto(values, costumer, senderHash);
                } else if (type === 'credito') {
                    transaction = PagseguroHelper.collectionCard(values, costumer, senderHash);
                } else {
                    throw new Error('Tipo de transação inválido');
                }
                console.log({ transaction });
                const transactionResult = await PagseguroHelper.newTransaction(transaction);
                const payment = await Payment.create({
                    transactionId: transactionResult.code[0],
                    status: 'WaitingForPayment',
                    userNome: costumer.nome,
                    userId: costumer._id,
                    tipo: 'Reseller',
                    valor: values.products,
                    frete: values.shipment,
                    total: values.total,
                });
                if (type === 'boleto') {
                    payment.boletoUrl = transactionResult.paymentLink[0];
                }
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
                return;
            }
            const err = new Error('Peças não encontradas');
            err.status = 404;
            return next(err);
        } catch (err) {
            return next(err);
        }
    })

module.exports = router;