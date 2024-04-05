const express = require('express')
const multer = require('multer');
const universityModel = require('../models/university');
const studentModel = require('../models/student');
const contract = require('../controllers/contract');
const router = express.Router() 
const upload = multer();

router.get('/addStudent' , async(req,res)=>{
    const signerAddress = req.session.account;
    console.log(req.session.account)
    console.log('Signer Address:', signerAddress);
    try {
        if (String(signerAddress).toLowerCase() == req.session.university) {
            // const fullStudent = await studentModel.findOne({studentAddress: studentAddress}).populate('university')
            // console.log(fullStudent)
            const accountAddress = await contract.methods.getAllUniversities().call();
            const university = await universityModel.findOne({universityAddress:signerAddress})
            const allStudentsList = await studentModel.find({university: university._id}).populate('university')
            const data = accountAddress.filter((item)=> {return String(item.universityAddress).toLowerCase() == String(signerAddress).toLowerCase()})
            // console.log(accountAddress)
            res.render('university', {studentList: allStudentsList, university: data[0].name});
        } else {
            res.json({message: 'You arent admin'});
        }
    } catch (error) {
        console.error(error)
    }
})


router.post('/addStudent' ,upload.single('studentProfile') ,async(req,res)=>{
    const { studentName , studentWalletAddress } = req.body
    const profileData = req.file.buffer
    const universityAddress = req.session.account
    try {
        
        const universityData = await universityModel.findOne({universityAddress: universityAddress})
        if(universityAddress){
            const studentData = await studentModel.create({
                university: universityData._id,
                studentName: studentName,
                studentAddress: studentWalletAddress,
                
                profile: profileData
            })

            // console.log('studentData added' , studentData)
            	console.log('added')
            // const fullStudent = await studentModel.findOne({studentAddress: studentAddress}).populate('university')
            // console.log(fullStudent)
        }
        else{
            res.json('Something just break')
        }

    } catch (error) {
        console.error(error)
    }
})



module.exports = router