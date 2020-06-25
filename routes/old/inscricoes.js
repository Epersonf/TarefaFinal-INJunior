var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mysql = require('mysql');

var inscricoesRouter = express.Router();
inscricoesRouter.use(bodyParser.json());

var banco = mysql.createConnection({
    host     : '187.45.189.100',
    user     : 'u215211862_betao',
    password : '8xvq9x8z',
    database : 'u215211862_amb'
});

inscricoesRouter.route('/')
    .get(function (req, res, next) {
        banco.connect();

        banco.query('SELECT * from possiveisconsultores', function(err, rows, fields) {
        if (!err)
            res.json(rows);
        else{
                //console.log('Error while performing Query.');
                res.json({'err': 'Problema na query'});
            }
        });

        banco.end();
    })
;

module.exports = inscricoesRouter;