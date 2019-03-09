var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var passport = require('passport');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let user = req.body;
        try {
            User.register(new User(user),
                user.password, function (err, user) {
                    if (err) {
                        return res.status(500).json({ err: err });
                    }
                    //console.log(user);
                    //criacaoo de configuracoes de consultor e supervisor

                    passport.authenticate('local')(req, res, function () {
                        return res.status(200).json({ status: 'Usuário registrado', id: user._id });
                    });
                });
        }
        catch (error) {
            res.status(404).json({ error });
        }
    })
    //retrieve
    .get(async (req, res) => {
        let { id, sort, skip, limit, nome, ...otherParams } = req.query;
        if (id) {
            let user = await User.findById(id);
            res.json(user);
        } else {
            let query = User.find({ ...otherParams, nome: { $regex: nome || '', $options: 'i' } })
                .populate(
                    {
                        'path': 'supervisor',
                        'select': '_id nome sobrenome whatsapp endereco cidade cep cpf'
                    });
            sort ?
                query = query.sort(sort) :
                null;
            limit ?
                query = query.limit(Number(limit)) :
                null;
            skip ?
                query = query.limit(Number(skip)) :
                null;

            console.log(query.getQuery());
            let users = await query.exec();
            res.json(users);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let user = req.body;
        if (id) {
            try {
                let newUser = await User.updateOne({ '_id': id }, { '$set': user });
                res.json(newUser);
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
                let remove = await User.deleteOne({ '_id': id });
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