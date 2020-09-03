const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    comapanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name : {type: String, required: true}
},{timestamps: true}, {usePushEach : true}
);

module.exports = mongoose.model('Project', projectSchema);
