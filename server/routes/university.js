const express = require('express')
// const {create} = require('ipfs-http-client')
const multer = require('multer');
const universityModel = require('../models/university');
const studentModel = require('../models/student');
const contract = require('../controllers/contract');
const router = express.Router() 
const upload = multer();
const { create } = require('ipfs-http-client');
const { routerAuth, isUniversity } = require('../middleware/Auth');
const hashMap = new Map()
// async function createNode(){
//     const {createHelia} = await import('helia')
//     const {unixfs} = await import('@helia/unixfs')
//     const helia = await createHelia()
//     const fs = unixfs(helia)
//     return fs
// }

const ipfs = create({ host: '127.0.0.1', port: 5001, protocol: 'http' });

router.post('/uploadToIPFS', upload.single('studentDocument'), async (req, res) => {
    try {
        const studentAddress = req.body.studentAddress;
        const fileData = req.file.buffer;
        const filrName = req.file.originalname
        const { cid } = await ipfs.add(fileData, { onlyHash: true });

        // Check if the hash already exists in the documentHash array
        const student = await studentModel.findOne({ studentAddress: studentAddress });
        const existingHash = student.documentHash.find(hashObj => hashObj.hash === cid.toString());

        if (existingHash) {
            console.log('File already exists in IPFS. CID:', cid.toString());
            return res.status(400).json({ error: 'File already exists' });
        }

        // If the hash does not exist, add it to the documentHash array
        const result = await ipfs.add(fileData);
        const hashData = {
            fileName: filrName,
            hash: cid.toString()
        };
        student.documentHash.push(hashData);
        await student.save();

        console.log('File uploaded to IPFS. CID:', cid.toString());
        res.status(200).json({ cid: cid.toString() });
        
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        res.status(500).json({ error: 'Failed to upload file to IPFS' });
    }
});


router.get('/addStudent' ,isUniversity, async(req,res)=>{
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
                studentAddress: String(studentWalletAddress).toLowerCase(),
                
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

// let studentAddress



router.post('/studentProfile/:address', async(req,res)=>{
    const address = req.params.address
    // studentAddress = address
    try {
        res.redirect(`/studentProfile?address=${address}`)
    } catch (error) {
        console.error(error) 
    }

})


router.get('/studentProfile' ,isUniversity, async(req,res)=>{
    try {
        const studentAddress = req.query.address
        // console.log(typeof studentAddress)
        const studentDetails = await studentModel.findOne({studentAddress: studentAddress}).populate('university')
        // console.log(fullStudent)
        res.render('studentProfile' , {studentDetails: studentDetails})
    } catch (error) {
        console.error(error)
    }
})




module.exports = router