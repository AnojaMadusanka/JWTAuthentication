const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//VALIDATION
const Joi = require('@hapi/joi');

const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

const loginValidation = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

router.post('/register', async(req, res)=>{

    //VALIDATE THE DATA BEFORE REGISTER A USER
    const { error } =   schema.validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    //Check if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists'); 

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try{
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err) {
        res.status(400).send(err); 
    }
});

router.post('/login', async(req, res)=>{
    //VALIDATE THE DATA BEFORE LOGIN A USER
    const { error } =   loginValidation.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking the email is exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or password is wrong'); 

    //IF THE PASSWORD IS CORRECT
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid password');

    //CREATE AND ASIGN A TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '15s' });   // IN FRONT KNOWS USER IS LOGGED IN AND HAVE ACCESS TO THIS ID

    //ADD CREATED TOKEN TO THE HEADER
    res.header('auth-token', token).send(token);

    res.send('Sucessfully Login');

});

module.exports = router;