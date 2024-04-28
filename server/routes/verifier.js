const express = require('express')
const studentModel = require('../models/student')
const {
    routerAuth,
    isVerifier
} = require('../middleware/Auth')
const verifierModel = require('../models/verifier')
const router = express.Router()

var studentList = null

router.get('/verifierHome', isVerifier, async (req, res) => {
    var std = []
    try {
        const student = await studentModel.find()
        const verifier = await verifierModel.findOne({
            email: req.session.account
        })
        // res.render('verifier', {
        //     studentsList: studentsList,
        //     verifier: verifier
        // })
        
        console.log(studentList)
        if(studentList == null) {
            return res.render('verifier-search', {verifier: verifier.name})
        }
        else {
            
            // std.push(studentList)
            res.render('verifier' , {studentsList: [studentList], verifier: verifier})
            studentList=null
        }
        
    } catch (error) {
        console.error(error)
    }

    
})

router.get('/verifier-viewing-student-docs',isVerifier, async (req, res) => {

    const studentAddress = req.query.address
    const verifier = req.session.account
    try {
        const studentDetails = await studentModel.findOne({
            studentAddress: studentAddress
        })
        const verifierD = await verifierModel.findOne({
            email: verifier
        })

        // console.log(verifierD)


        // studentDetails.documentHash.forEach((doc) => {
        //     // console.log(doc)
        //     studentDetails.verifierList.forEach((doc) => {
        //         console.log(doc)
        //     })
        // })
        res.render('verifier-student', {
            studentDetails: studentDetails,
            verifierD: verifierD
        })
    } catch (error) {
        console.error(error)
    }


    // try {
    //     const studentDetails = await studentModel.findOne({studentAddress: studentAddress})
    // } catch (error) {
    //     console.error(error)
    // }
})


router.post('/request-doc' ,isVerifier, async(req,res)=>{
    const docId = req.query.docId 
    const studId = req.query.studId 

    try {
        const verifier = await verifierModel.findOne({email: req.session.account}) 
        const student = await studentModel.findOne({_id: studId})

       const doc =  student.documentHash.find((item) => {return item._id == docId})
       const isAlreadyRequested = verifier.requestedDocs.some((item) => {return item.hash == doc.hash})

       if(!isAlreadyRequested) {
        const docuHash = {
            hash: doc.hash,
            documentName: doc.fileName,
            studId: student._id,
            Auth: false
        }
        verifier.requestedDocs.push(docuHash)
        await verifier.save()
        res.redirect(`/verifier-viewing-student-docs?address=${student.studentAddress}`)
       }
       else{
        console.log('already requested')
    }
    } catch (error) {
        console.error(error)
        res.json({message: 'some error'})
    }
})


// router.post('/request-doc', async (req, res) => {
//     const docId = req.query.docId;
//     const studId = req.query.studId;
//     try {
//         // Find the verifier by email
//         const verifier = await verifierModel.findOne({
//             email: req.session.account
//         }).select('_id');

//         if (!verifier) {
//             console.log('Verifier not found.');
//             return res.status(404).send('Verifier not found.');
//         }

//         // Find the student by ID
//         const student = await studentModel.findOne({
//             _id: studId
//         });

//         if (!student) {
//             console.log('Student not found.');
//             return res.status(404).send('Student not found.');
//         }

//         const existingEntryIndex = student.verifierList.findIndex(entry => entry.docuHash && entry.docuHash._id.toString() === docId);

//         if (existingEntryIndex !== -1) {
//             const existingVerifierIndex = student.verifierList[existingEntryIndex].verifiers.findIndex(verifierEntry => verifierEntry.verifier.toString() === verifier._id.toString());

//             if (existingVerifierIndex === -1) {
//                 // Push the verifier to the existing entry in verifierList
//                 student.verifierList[existingEntryIndex].verifiers.push({
//                     verifier: verifier._id
//                 });
//                 await student.save();

//                 // const docHash = {
//                 //     hash:
//                 // }
//                 // verifier.requestedDocs.find()

//                 console.log('Verifier added to existing entry.');
//             } else {
//                 const n = student.documentHash.find(item => item.hash === 'QmUW2SXM9fH91CQKxwBtnXs1Awnww2mcKqK3JJUmoPfvLP');
//                 const verif = await verifierModel.findOne({
//                     email: req.session.account
//                 });

//                 console.log('verifier ' , verif)

//                 // Check if the document hash already exists in requestedDocs
//                 const isAlreadyRequested = verif.requestedDocs.some(doc => doc.hash === 'QmUW2SXM9fH91CQKxwBtnXs1Awnww2mcKqK3JJUmoPfvLP');

//                 if (!isAlreadyRequested) {
//                     const docHash = {
//                         hash: n.hash,
//                         studId: student._id,
//                         Auth: false
//                     };
//                     verif.requestedDocs.push(docHash);
//                     await verif.save();
//                     console.log('Verifier already exists for this document.');
//                 } else {
//                     console.log('Document already requested by the verifier.');
//                 }

//             }
//         } else {
//             // Document not found in verifierList, create a new entry
//             const doc = student.documentHash.find(item => item._id.toString() === docId);

//             if (!doc) {
//                 console.log('Document not found.');
//                 return res.status(404).send('Document not found.');
//             }

//             student.verifierList.push({
//                 docuHash: doc,
//                 verifiers: [{
//                     verifier: verifier._id
//                 }]
//             });

//             await student.save();
//             console.log('New entry added to verifierList.');
//         }

//         res.status(200).send('Verifier added successfully.');
//     } catch (error) {
//         console.log('Error adding verifier:', error);
//         res.status(500).send('Error adding verifier: ' + error.message);
//     }
// });


router.post('/search-student',isVerifier ,async(req,res)=>{

    const {studentAddress} = req.body
    const std = studentAddress.toLowerCase()
    try {
       studentList =  await studentModel.findOne({studentAddress: std}).populate('university')
       res.redirect('/verifierHome')
    } catch (error) {
        console.error(error)
    }
})



module.exports = router