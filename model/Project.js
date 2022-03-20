const mongoose = require('mongoose');
const bucketSchema = require('./Buckets').schema;

const projectSchema = mongoose.Schema({
    buckets: {type: bucketSchema},
    projectTitle:{
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    userList: {
        type: Array
    },
    date:{
        type: Date,
        default: Date.now
    },
    description:{
        type: String,
        min: 3
    }

});

module.exports = mongoose.model('Project', projectSchema);