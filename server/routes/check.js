const express= require('express')
const { setSignerAddress } = require('../middleware/Auth')
const contract = require('../controllers/contract');
const studentModel = require('../models/student');
const router = express.Router()


router.post('/check', setSignerAddress, async(req, res) => {
    const { signerAddress } = req.body;
    const adminAddress = process.env.ADMIN_ADDRESS.toLowerCase();
    
    try {
        req.session.account = signerAddress;

            console.log(req.session.account)
        const account = signerAddress.toString().toLowerCase();
        const accountAddress = await contract.methods.getAllUniversities().call();
        

        // console.log('acccccc' , account)
        // console.log('acsdbeudd' , accountAddress)
        const universityAddress = accountAddress.find(item => item.universityAddress.toLowerCase() === account);
        console.log(universityAddress)
        // console.log('ssadsadasad' , universityAddress)
        // const studentAddresses = await contract.getAllStudentNames().call()
        // console.log(studentAddresses)
        const student = await studentModel.findOne({studentAddress: account})
        // console.log(student)
        if (universityAddress && universityAddress.universityAddress.toLowerCase() === account && universityAddress.universityAddress.toLowerCase() !== adminAddress) {
            req.session.university = account;
            console.log(req.session.university)
            return res.json({ redirectTo: '/addStudent', message: '' });
        }
        // else if()

         if (account === adminAddress) {
            return res.json({ redirectTo: '/addUniversity', message: '' });
        }
        else if(student.studentAddress == account){
            return res.json({redirectTo: '/student'})
        }

        else {
            return res.json({redirectTo: '/', message: 'Not authorized, Contact Admin or your Organization to add you :)'})
        }
         
    } catch (err) {
        console.error(err);
        return res.json({redirectTo: '/', message: 'Not authorized, Contact Admin or your Organization to add you :)'})
    }
});


module.exports = router