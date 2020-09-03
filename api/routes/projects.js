const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Company = require('../models/company/company');
const Project = require('../models/projects/projects');

router.post('/', (req, res, next) => {
    Company.findById(req.body.id)
    .then(comapny => {
        if(!comapny){
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