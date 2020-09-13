const express = require('express');
const app = express();
const morgan  = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const expressValidator = require('express-validator');

const companyRoutes = require('./api/routes/companies');
const issuesRoutes = require('./api/routes/issues');
const productRoutes = require('./api/routes/products');
const projectRoute = require('./api/routes/projects');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

// const uri = "mongodb://devadmin:Titandef#1@cluster0-shard-00-00.25old.mongodb.net:27017,cluster0-shard-00-01.25old.mongodb.net:27017,cluster0-shard-00-02.25old.mongodb.net:27017/Shop?ssl=true&replicaSet=atlas-m61i7o-shard-0&authSource=admin&retryWrites=true";

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json());
app.use(cors())

app.use('/api/companies', companyRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoute);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.set('useCreateIndex', true);

mongoose.connect( process.env.databaseLink,  //|| "mongodb://localhost:27017/Shop",
    {
        useUnifiedTopology: true, useNewUrlParser : true
    }
  );
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({error :{message : error.message}})
});

module.exports = app;
