const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const basename = path.basename(module.filename);

const db = [];

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(mongoose.Schema);
    const modelName = file.substr(0, file.length - 3);
    db.push({model,modelName});
  });

module.exports = db;
