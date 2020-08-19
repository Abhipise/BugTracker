const express = require('express');
const indexRouter = require('./routes/index');

const app = express();

app.listen(8000, () => {
    console.log("Server is listing on port:",8000);
});

app.use('/', indexRouter)