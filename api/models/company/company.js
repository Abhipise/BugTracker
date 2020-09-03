const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : {type : String, required : true},
    createdBy : {type : String},
    updatedAt : {type : String},
    deletedAt : {type : Date}
},
    {timestamps: true}, {usePushEach : true}
);

module.exports = mongoose.model('Company', companySchema);
