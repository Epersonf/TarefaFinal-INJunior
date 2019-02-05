var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.route('/')
    //create
    .post(async (req, res, next) => {
        let user = req.body;
        try{
            let newUser = await User.create(user); 
            /* req.user = newUser;
            console.log('API: ', user);
            next();  */
            res.status(200).json(newUser);
        } 
        catch (error) {
            res.status(404).json({error});
        }        
    })
    //retrieve
    .get(async (req, res) => {
        let { id, ...otherParams } = req.query;
        if (id) {
            let user = await User.findById(id);
            res.json(user);
        } else {
            let users = await User.find(otherParams).exec();
            res.json(users);
        }
    })
    //update
    .put(async (req, res) => {
        let { id } = req.query;
        let user = req.body;
        if (id) {
            try{
                let newUser = await User.updateOne({'_id': id}, {'$set': user});
                res.json(newUser);
            }
            catch(error){
                res.status(404).json({error});
            }
            
        } else {
            res.status(400).json({ error: 'Missing ID' });
        }
    })
    //delete
    .delete(async (req, res) => {
        let { id } = req.query;
        if (id) {
            try{
                let remove = await User.deleteOne({'_id': id});
                res.json(remove);
            }
            catch(error){
                console.log('error');
                res.status(404).json(error);
            }
            
        } else {
            res.status(400).json({ error: 'Missing ID' });
        }
    })

module.exports = router;