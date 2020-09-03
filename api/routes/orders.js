const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders/order');
const Product = require('../models/products/product')

router.get('/', (req, res, next) => {
    Order.find()
    .select('productId quantity _id')
    .populate('productId', 'name')
    .exec()
    .then(
        docs => {console.log(docs),res.status(200).json({count: docs.length, orders:docs})}
    )
    .catch(
        err => {console.log(err), res.status(500).json({errror:err})}
    )
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.id)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message : "product not found"
            })
        }
        const order = new Order({
            _id : mongoose.Types.ObjectId(),
            quantity : req.body.quantity,
            productId : req.body.id
        });
        return order.save()
        .then(
            result => {console.log(result),res.status(201).json(result)}
        )
        })
    .catch(err => {console.log(err),res.status(500).json({error:err,message: "product not found"})})

});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id).exec().then().catch()
    if(id === "special"){
        res.status(200).json({message : "OrderSpecial id",id:id})
    }else {
        res.status(200).json({message : "OrderNot special id"})
    }
})


module.exports = router;