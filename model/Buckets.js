const mongoose = require('mongoose');
const bucketSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
        min: 3
    },
    tasks: [{
        title: {type:String, required: true},
        dateCreated: {type: Date, default:Date.now},
        usersAssgn: String,
        dueDate: Date,
        description: String,
        bucket: {type: String, required:true},
        status: {type: String, required:true, default:'Not started'},
        checkList: Array
    }],

})

module.exports = mongoose.model('Buckets', bucketSchema);