var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify    = require('./verify');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }),
      req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({status: 'Registration Successful!'});
        });
    });
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        
      var token = Verify.getToken(user);
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
		user: user
      });
    });
  })(req,res,next);
});

router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;




// userRouter.use(bodyParser.json());

// userRouter.route('/')
// .get(function (req, res, next) {
    // User.find({}, function (err, user) {
        // if (err) throw err;
        // res.json(user);
    // });
// })

// .post(function (req, res, next) {
    // User.create(req.body, function (err, user) {
        // if (err) throw err;
        // console.log('Usuário criado');
        // // var id = user._id;

        // // res.writeHead(200, {
            // // 'Content-Type': 'text/plain'
        // // });
        // // res.end('Pessoa adicionada com o id: ' + id);
		// res.json(user);
    // });
// })

// .delete(function (req, res, next) {
    // User.remove({}, function (err, resp) {
        // if (err) throw err;
        // res.json(resp);
    // });
// });

// userRouter.route('/:id')
// .get(function (req, res, next) {
    // User.findById(req.params.id, function (err, user) {
        // if (err) throw err;
        // res.json(user);
    // });
// })

// .put(function (req, res, next) {
    // User.findByIdAndUpdate(req.params.id, {
        // $set: req.body
    // }, {
        // new: true
    // }, function (err, dish) {
        // if (err) throw err;
        // res.json(dish);
    // });
// })

// .delete(function (req, res, next) {
    // User.findByIdAndRemove(req.params.id, function (err, resp) {        if (err) throw err;
        // res.json(resp);
    // });
// });

// module.exports = userRouter;