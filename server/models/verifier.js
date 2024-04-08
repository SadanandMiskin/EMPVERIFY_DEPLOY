const mongoose = require('mongoose')

const students = mongoose.Schema({
    studentList: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
    },
    approved: Boolean
    
})

const verifierSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
   
    studentsApplied: [students]
})

const verifierModel = mongoose.model('verifierModel' , verifierSchema)

module.exports = verifierModel