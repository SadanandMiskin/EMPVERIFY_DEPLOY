const mongoose = require('mongoose')

// const requests= mongoose.Schema({
//     verifier: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'verifier',
        
//     },
//     Auth: {
//         type: Boolean,
//         default: false

//     }
// })

const docuHash = mongoose.Schema({
    fileName: String,
    hash: String
})

const verifierAccessDoc = mongoose.Schema({
    verifier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'verifier'
    },
    Auth: {
        type:Boolean,
        default: false
    }
})

const requests = mongoose.Schema({
    docuHash: docuHash,
    verifiers: [verifierAccessDoc]
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
    documentHash: [docuHash],
    verifierList: [requests]
})

const studentModel = mongoose.model('studentModel' , studentSchema)

module.exports = studentModel