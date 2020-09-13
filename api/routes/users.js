const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');

const User = require('../models/users/user');

router.post('/signup',[
    body('email').isEmail().withMessage('Please enter correct email id'),
    body('name').isString().withMessage('Name should be string'),
    body('password').isLength(5).withMessage('Length of password should be gratert than 5 ')
    ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }    User.find({email : req.body.email})
    .exec()
    .then(user =>
        {
            if (user.length){
                return res.status(409).json({message: "user already exits"})
            } else {
                bcrypt.hash(req.body.password, 10, (err,hash) => {
                    if (err) {
                        return res.status(500).json({error:err})
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            name: req.body.name,
                            password: hash
                        });
                        user.save()
                        .then(result=>{res.status(201).json({message : "userCreated"})})
                        .catch(err => {res.status(500).json({error:err})})
                    }
                });
            }
        })
    .catch(err => {res.status(500).json({error:err})})
})

router.post('/login', (req, res, next) =>{
    User.find({ email: req.body.email })
    .exec()
    .then( user => {
            if (user.length < 1){
                return res.status(401).json({message: "Auth Failed"})
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result ) => {
            if (err) {
                return res.status(401).json({message: "Auth Failed before login"})
            }
            if ( result ) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                })
                return res.status(200).json({message : "Auth Successful",token: token});
            }
            return res.status(401).json({message: "Auth Failed in bcrypt"});
        });
    })
    .catch(err => {res.status(500).json({error:err, message:"Auth failed last"})})

})

router.delete('/:id',(req, res, next) => {
    User.find({ _id : req.params.id}).exec().then(
        result => {
            if (result.length){
                User.remove({ _id: req.params.id })
                    .exec()
                    .then(res.status(200).json({ message : "User deleted" }))
            } else {
                return res.status(500).json({ error : err ,message : "not deleted"})
            }
        }
    ).catch(err => {res.status(500).json({error:err, message:"User not found"})})
})

router.get("/", (req,res,next)=> {
    User.find()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {console.log(err),res.status(500).json({error:err})});

});

module.exports = router;
