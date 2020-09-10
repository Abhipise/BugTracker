const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Project = require('../models/projects/projects');
const User = require('../models/users/user');
const Issues = require('../models/issues/issues');

router.post('/', (req, res, next) => {
    Project.findById(req.body.projectId)
    .then(project => {
        if(!project){
            return res.status(404).json({
                message : "project not found"
            })
        }
        User.findById(req.body.assignedTo)
        .then(User => {
            if(!User){
                return res.status(404).json({
                    message : "User not found"
                })
            }
                const issues = new Issues({
                    _id : mongoose.Types.ObjectId(),
                    name : req.body.name,
                    projectId : req.body.projectId,
                    title : req.body.title,
                    type : req.body.type,
                    taskNumber : req.body.taskNumber,
                    severity : req.body.severity,
                    assignedTo : req.body.assignedTo
                });
                console.log(issues,"lllll");
                return issues.save()
                .then(
                    result => {console.log(result),res.status(201).json(result)}
                )
                .catch(err => res.status(500).json({error:"Issue not created 1"}))
            })
            .catch(err => res.status(500).json({error:"Issue not created 2 "}))
        })
    .catch(err => {console.log(err),res.status(500).json({error:err,message: "Issue not Created3 "})})
    });

    router.get('/', (req,res,next)=> {
        Issues.find()
        .then(result => {
            res.status(200).json(result);
        })    .catch(err => {console.log(err),res.status(500).json({error:err})});   
    });

    router.get('/:id', (req,res,next)=> {
        const id = req.params.id;
        Issues.findById(id).exec()
        .then(issues => {
            res.status(200).json(issues);
        })    
        .catch(err => {console.log(err),res.status(500).json({error:err})});
    });

module.exports = router;