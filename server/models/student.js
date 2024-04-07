const mongoose = require('mongoose')


const docuHash = mongoose.Schema({
    fileName: String,
    hash: String
})

const studentSchema = mongoose.Schema({
    university: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'universityModel'
    },
    studentName: String,
    studentAddress: String,
    profile: Buffer,
    documentHash: [docuHash]
})

const studentModel = mongoose.model('studentModel' , studentSchema)

module.exports = studentModel