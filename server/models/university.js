const mongoose = require('mongoose')

const universitySchema = mongoose.Schema({
    universityName: String,
    universityAddress: String,
    logo: Buffer
})

const universityModel = mongoose.model('universityModel' , universitySchema)

module.exports = universityModel