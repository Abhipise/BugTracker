const express = require('express');
const router = express.Router();

const Product = require('../models/products/product');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/checkAuth');

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then( docs => {
        const response = {
            count: docs.length,
            products : docs.map((doc) => {
                return {
                    name : doc.name,
                    price : doc.price,
                    _id : doc._id,
                    request :{
                        type: "GET",
                        url : "http://localhost:3000/products/" + doc._id
                    }
                }
            })
        }
        console.log(docs),
        res.status(200).json(response);
    })
    .catch(err => {console.log(err),res.status(500).json({error:err})});
});

router.post('/', checkAuth, (req, res, next) => {
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    });
    product
    .save()
    .then(result => {
        res.status(201).json({
            message : "Handling Post request to /products",
            createdProducts : result
        });
    })
    .catch(err => {console.log(err);});
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json({doc })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
})

router.patch("/:id", (req, res, next) =>{    
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body){
        console.log(ops,ops.propName,ops.value);
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id:id}, {$set: updateOps})
    .exec()
    .then(result => {console.log(result),res.status(200).json(result)})
    .catch( err => {console.log(err),res.status(500).json({error:err})})
});

router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
    Product.remove({_id:id})
    .exec()
    .then(result => { res.status(200).json(result)})
    .catch(err => {res.status(500),json({error:err})})
})

module.exports = router;