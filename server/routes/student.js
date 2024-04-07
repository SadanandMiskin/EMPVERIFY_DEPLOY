const express = require('express')
const studentModel = require('../models/student')
const router = express.Router()

router.get('/student' , async(req,res)=>{
    
    try{
        // const student = studentModel.findOne({})
        const sessionAddress = String(req.session.account).toLowerCase()
        console.log(sessionAddress)
        const student = await studentModel.findOne({studentAddress : sessionAddress})
        // console.log(student)
        res.render('student' , {student: student})
    }
    catch(err) {
        console.error(err)
    }
})


module.exports = router