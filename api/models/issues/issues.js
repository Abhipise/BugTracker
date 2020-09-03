const mongoose = require('mongoose');

const issueSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : {type: String, required: true},
    projectId : {type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
    title : {type: String, required: true},
    type : {type: String, enum: ['backlog','notAnIssue','todo','doing','done','tested'], required: true, default: "backlog"},
    taskNumber : {type:Number, required: true},
    severity : {type: String, enum:['notSet','critical','important','normal','minor'], default:'notSet',required: true},
    assignedTo : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    attachment : {type : String},
    comment : {type: String}
},{timestamps: true}, {usePushEach : true}
);

module.exports = mongoose.model('Issues', issueSchema);
