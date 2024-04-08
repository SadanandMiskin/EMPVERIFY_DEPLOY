const mongoose = require('mongoose')
 const db = async () => {
    try {
        const uri = process.env.MONGO_URI
       await mongoose.connect(uri)
        console.log('MongoDB Connected')
    }
    catch(err) {
        console.log(err)
    }
} 

module.exports = {db}