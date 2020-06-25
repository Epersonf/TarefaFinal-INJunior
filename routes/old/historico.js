var express = require('express');
var router = express.Router();
var passport = require('passport');
var Historico = require('../../models/historico');
var PecaLog = require('../../models/pecalog');

router.post('/', function (req, res, next) {
  Historico.create(req.body, function (err, consultor) {
    if (err) throw err;
    res.json('Historico criado!');
  });
});

router.delete('/', function (req, res, next) {
  Historico.remove({}, function (err, resp) {
    if (err) throw err;
    res.json(resp);
  });
});

router.get('/vendas', function (req, res, next) {
  Historico.findOne({}, function (err, historico) {
    if (err) throw err;
    res.json(historico.vendas);
  });
});
router.post('/vendas', function (req, res, next) {
  Historico.update(
    {},
    { $push: { vendas: { $each: req.body.vendas } } },
    function (err, consultor) {
      if (err) throw err;
      res.json('Peças adicionadas!');
    }
  );
});

router.get('/entrada', function (req, res, next) {
  Historico.findOne({}, function (err, historico) {
    if (err) throw err;
    res.json(historico.entrada);
  });
});
router.post('/entrada', function (req, res, next) {
  Historico.update(
    {},
    { $push: { entrada: { $each: req.body.entrada } } },
    function (err, consultor) {
      if (err) throw err;
      PecaLog.create({ acao: 'entrada', pecas: req.body.entrada }, function (
        err,
        pecalog
      ) {
        if (err) throw err;
        res.json('Peças Adicionadas');
      });
    }
  );
});

router.get('/pecalog', function (req, res, next) {
  PecaLog.find({}, function (err, pecalog) {
    if (err) throw err;
    res.json(pecalog);
  });
});

module.exports = router;
