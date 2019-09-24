var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var passport = require('passport');
const Verify = require('../verify');
const userHelper = require('../../helpers/userHelper');

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
                    passport.authenticate('local')(req, res, function () {
                        return res.status(200).json({ status: 'Usuário registrado', id: user._id });
                    });
                });
        }
        catch (err) {
            return next(err);
        }
    })
    //retrieve
    .get(Verify.verifyOrdinaryUser, async (req, res, next) => {
        let { id, sort, skip, inactive, limit, nome, ...otherParams } = req.query;

        /* if (id !== req.decoded._id) {
            Verify.verifyRole(next, req.decoded.type,
                [
                    userHelper.roles.admin,
                    userHelper.roles.controller,
                ]);
        } */

        try {
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
                inactive ?
                    null :
                    query = query.find({ status: { $ne: 'Inativo' } })
                sort ?
                    query = query.sort(sort) :
                    null;
                limit ?
                    query = query.limit(Number(limit)) :
                    null;
                skip ?
                    query = query.skip(Number(skip)) :
                    null;

                let users = await query.exec();
                res.json(users);
            }
        } catch (err) {
            return next(err);
        }
    })
    //update
    .put(async (req, res, next) => {
        const { id, status } = req.query;
        const user = req.body;
        console.log(user);
        if (id) {
            try {
                if (user.password) {
                    const userToChange = await User.findById(id);
                    await userToChange.setPassword(user.password);
                    await userToChange.save();
                    res.status(200).json({ msg: 'Password changed' });
                } else {
                    let newUser = await User.updateOne({ '_id': id }, { '$set': user });
                    if (status) {
                        req.notification = {
                            to: id,
                            type: "STATUS_CHANGED",
                            content: [status]
                        }
                        next();
                    }
                    res.json(newUser);
                }
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
        Verify.verifyRole(next, req.decoded.type,
            [
                userHelper.roles.admin,
            ]);

        let { id } = req.query;
        if (id) {
            try {
                let remove = await User.deleteOne({ '_id': id });
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