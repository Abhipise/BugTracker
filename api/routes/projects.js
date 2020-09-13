const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const Company = require('../models/company/company');
const Project = require('../models/projects/projects');

router.post('/',[
    body('name').isString().withMessage('name of project must be string')
    ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    Company.findById(req.body.id)
    .then(comapany => {
        if(!comapany){
            return res.status(404).json({
                message : "Company not found"
            })
        }
        const project = new Project({
            _id : mongoose.Types.ObjectId(),
            name : req.body.name,
            comapanyId : req.body.id
        });
        return project.save()
        .then(
            result => {console.log(result),res.status(201).json(result)}
        )
        })
    .catch(err => {console.log(err),res.status(500).json({error:err,message: "project not found"})})
});

router.get("/", (req,res,next)=> {
        Project.find()
        .then(result => {
            res.status(200).json(result);
        })    .catch(err => {console.log(err),res.status(500).json({error:err})});
    
    });

router.get("/:id", (req,res,next)=> {
        const id = req.params.id;
        Project.findById(id).exec()
        .then(project => {
            res.status(200).json(project);
        })    
        .catch(err => {console.log(err),res.status(500).json({error:err})});
    
    });

module.exports = router;