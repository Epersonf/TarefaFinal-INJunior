var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Consultor = require('../models/consultores');

var consultorRouter = express.Router();
consultorRouter.use(bodyParser.json());

consultorRouter.route('/')
.get(function (req, res, next) {
    Consultor.find({}, function (err, consultor) {
        if (err) throw err;
        res.json(consultor);
    });
})

.post(function (req, res, next) {
    Consultor.create(req.body, function (err, consultor) {
        if (err) throw err;
        console.log('consultor criada');
        var id = consultor._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('consultor adicionada com o id: ' + id);
    });
})

.delete(function (req, res, next) {
    Consultor.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

consultorRouter.route('/:id')
.get(function (req, res, next) {
    Consultor.findById(req.params.id, function (err, consultor) {
        if (err) throw err;
        res.json(consultor);
    });
})

.put(function (req, res, next) {
    Consultor.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function (err, consultor) {
        if (err) throw err;
        res.json(consultor);
    });
})

.delete(function (req, res, next) {
    Consultor.findByIdAndRemove(req.params.id, function (err, resp) {        if (err) throw err;
        res.json(resp);
    });
});

consultorRouter.route('/:id/personalizados')
.get(function (req, res, next) {
    Consultor.findById(req.params.id, function (err, consultor) {
        if (err) throw err;
        res.json(consultor.personalizados);
    });
})

.post(function (req, res, next) {
	Consultor.findById(req.params.id, function (err, consultor) {
        if (err) throw err;
        consultor.personalizados.push(req.body);
		consultor.save(function (err, consultor) {
            if (err) throw err;
            console.log('Peça personalizada adicionada!');
            res.json(consultor);
        });
    });
})

.delete(function (req, res, next) {
    Consultor.findById(req.params.id, function (err, consultor) {
        if (err) throw err;
		for (var i = (consultor.personalizados.comments.length - 1); i >= 0; i--) {
            consultor.personalizados.id(consultor.personalizados[i]._id).remove();
        }
		consultor.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Todas as peças personalizadas foram deletadas!');
        });
    });
});

consultorRouter.route('/:id/personalizados/:peca')
.get(function (req, res, next) {
    Consultor.findById(req.params.id, function (err, consultor) {
        if (err) throw err;
        res.json(consultor.personalizados.id(req.params.peca));
    });
})

.put(function (req, res, next) {
	Consultor.findById(req.params.id, function (err, consultor) {
        if (err) throw err;
		consultor.personalizados.id(req.params.peca).remove();
        consultor.personalizados.push(req.body);
		consultor.save(function (err, consultor) {
            if (err) throw err;
            console.log('Peça personalizada atualizada!');
            res.json(consultor);
        });
    });
})

.delete(function (req, res, next) {
    Consultor.findById(req.params.id, function (err, consultor) {
        if (err) throw err;
		consultor.personalizados.id(req.params.peca).remove();
		consultor.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});

consultorRouter.route('/supervisor/:id')
.get(function (req, res, next) {
    Consultor.find({"supervisor": req.params.id}, function (err, consultor) {
        if (err) throw err;
        res.json(consultor);
    });
});

// .delete(function (req, res, next) {
    // Consultor.findByIdAndRemove(req.params.id, function (err, resp) {        if (err) throw err;
        // res.json(resp);
    // });
// });

consultorRouter.route('/pessoal/:pessoa')
.get(function (req, res, next) {
    Log.find({"pessoaId": req.params.pessoa}, function (err, log) {
        if (err) throw err;
        res.json(log);
    });
})

.delete(function (req, res, next) {
    Log.remove({"pessoaId": req.params.pessoa}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

module.exports = consultorRouter;