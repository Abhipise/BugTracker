const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');


const Company = require('../models/company/company');

router.post('/',[
        body('name').isString().withMessage('name of Company must br string')
        ], (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const company = new Company({
            _id : new mongoose.Types.ObjectId(),
            name : req.body.name,
            deletedAt : null
        });
        company.save()
        .then(
            result => {console.log(result),res.status(201).json(result)}
        )
    .catch(err => {console.log(err),res.status(500).json({error:err,message: "company not created"})})
    });

router.get("/", (req,res,next)=> {
    Company.find()
    .then(result => {
        res.status(200).json(result);
    })    .catch(err => {console.log(err),res.status(500).json({error:err})});

})

router.get('/:id', (req,res,next)=> {
    const id = req.params.id;
    Company.findById(id).exec()
    .then(company => {
        res.status(200).json(company);
    })
    .catch(err => {console.log(err),res.status(500).json({error:err})});
});

module.exports = router;
