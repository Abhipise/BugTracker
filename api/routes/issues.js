const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const Project = require('../models/projects/projects');
const User = require('../models/users/user');
const Issues = require('../models/issues/issues');

router.post('/',[
    body('name').isString().withMessage('name of issue must be string'),
    body('title').isString().withMessage('title of issue should be string'),
    body('taskNumber').isString().withMessage('type of issue should be number'),
    ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
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

    router.put('/:id', (req,res,next)=> {
        const id = req.params.id;
        let issue = Issues.findOne({_id:id})
        .then( result => {
                issue = Object.assign(result, req.body);
                issue.save()
                console.log(result),res.status(200).json(result)
        })
        .catch(err => res.status(500).json({error:"Issue not updated 1"}))
    });

module.exports = router;