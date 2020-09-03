const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/users/user');

router.post('/signup', (req, res, next) => {
    User.find({email : req.body.email})
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
    console.log(req.body.email,req.body.password);
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

module.exports = router;
