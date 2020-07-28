const express = require('express');
const router = express.Router();
const verify = require('../middleware/verifyToken');

router.get('/', verify, async(req, res)=>{
    res.json({
        post: {
            title: 'my first post',
            description: 'random data you shouldnt access'
        }
    });
    console.log(req.user);   //user is attached to the req in verifiedToken section
});

module.exports =router;