const express = require('express');
const router = express.Router();
const cloudinaryHelper = require('../../helpers/cloudinaryHelper');

router.route('/image')
    .post(cloudinaryHelper.single('image'), async (req, res) => {
        res.status(200).json({url: req.file.url, id: req.file.public_id});
    });

module.exports = router;