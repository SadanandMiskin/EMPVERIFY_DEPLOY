const mongoose = require('mongoose')
 const db = async () => {
    try {
       await mongoose.connect('mongodb://0.0.0.0:27017')
        console.log('MongoDB Connected')
    }
    catch(err) {
        console.log(err)
    }
} 

module.exports = {db}