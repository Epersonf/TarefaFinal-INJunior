const express = require("express");
const bcrypt = require("bcryptjs");
const UserModel = require("../../../models/userModel/user");
const tokenController = require("../../../controller/tokenController/tokenController");

const router = express.Router();
router.get('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send({ 'error': 'User not found!' });

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ 'error': 'Invalid password' });
    
    user.password = undefined;
    res.send({
        user,
        token: await tokenController.generateToken(user.id)
    });
});

module.exports = router;