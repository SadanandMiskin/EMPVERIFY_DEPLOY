const express = require('express')
const studentModel = require('../models/student')
const { routerAuth } = require('../middleware/Auth')
const verifierModel = require('../models/verifier')
const router = express.Router()

router.get('/student' ,routerAuth, async(req,res)=>{
    
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

router.get('/accept-request', routerAuth, async (req, res) => {
    const sessionAddress = String(req.session.account).toLowerCase();
    console.log(sessionAddress);
    try {
        const student = await studentModel.findOne({ studentAddress: sessionAddress });
        const studId = student._id.toString(); 
        console.log(studId);

        const verifiers = await verifierModel.find();
        // const verifierList  = verifiers.flatMap(verifier => verifier.requestedDocs)
        // const allRequestedDocs = verifierList.filter(doc => doc.studId == studId);

        // console.log(allRequestedDocs);
        res.render('acceptreq' , { verifierList: verifiers, studId: studId})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/accept-request', routerAuth , async(req,res)=>{
    const {verifier, doc} = req.query
    try {
        const verif = await verifierModel.findOneAndUpdate(
            { _id: verifier, 'requestedDocs.hash': doc },
            { $set: { 'requestedDocs.$.Auth': true } },
            { new: true }
        )
        console.log('updated')
        res.redirect('/accept-request')
    } catch (error) {
        console.error(error)
    }
})

router.post('/revoke-request' , routerAuth , async(req,res)=>{
    const { verifier , doc } = req.query
    try {
        // const verif = await verifier.findOne({_id: verifier})
        const updatedVerifier = await verifierModel.findOneAndUpdate(
            { _id: verifier }, // Find the verifier by ID
            { $pull: { requestedDocs: { hash: doc } } }, // Remove the requestedDoc with the specified hash
            { new: true }
        )
        console.log('fdeleted')
        res.redirect('/accept-request')
    } catch (error) {
        console.error(error)
    }
})


module.exports = router