const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    university: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'universityModel'
    },
    studentName: String,
    studentAddress: String,
    profile: Buffer
})

const studentModel = mongoose.model('studentModel' , studentSchema)

module.exports = studentModel