const mongoose = require('mongoose')

// const students = mongoose.Schema({
//     studentList: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'student',
//     },
//     approved: Boolean
// })

const docHash = mongoose.Schema({
    hash: String,
    documentName: String,
    studId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    Auth: {
        type: Boolean,
        default: false
    }
})

const verifierSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
   
    // studentsApplied: [students]
    requestedDocs: [docHash]
})

const verifierModel = mongoose.model('verifierModel' , verifierSchema)

module.exports = verifierModel