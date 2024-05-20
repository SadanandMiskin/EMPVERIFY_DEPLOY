require('dotenv').config()
const express = require('express')
// const {create} = require('ipfs-http-client')
const multer = require('multer');
const universityModel = require('../models/university');
const studentModel = require('../models/student');
const contract = require('../controllers/contract');
const router = express.Router() 
const upload = multer({ storage: multer.memoryStorage() });
const ipfsClient = require('ipfs-http-client');
const { routerAuth, isUniversity } = require('../middleware/Auth');
const hashMap = new Map()
// async function createNode(){
//     const {createHelia} = await import('helia')
//     const {unixfs} = await import('@helia/unixfs')
//     const helia = await createHelia()
//     const fs = unixfs(helia)
//     return fs
// }
// const { NFTStorage, File } = require('nft.storage');
const { ThirdwebStorage } = require('@thirdweb-dev/storage');
const storage = new ThirdwebStorage({
    secretKey: process.env.STORAGE
  });
const fs = require('fs')
const path = require('path');
// const endpoint = 'https://api.nft.storage' 
// const token = process.env.NFT_STORAGE_API_TOKEN 
// const client =  new NFTStorage({endpoint, token })




//   const ipfs = ipfsClient.create({
//     host: 'api.pinata.cloud',
//     port: 5001,
//     protocol: 'https',
//     headers: {
//       pinata_api_key: process.env.PINATA_API_KEY,
//       pinata_secret_api_key: process.env.PINATA_API_SECRET
//     }
//   });
  

//   router.post('/uploadToIPFS', upload.single('studentDocument'), async (req, res) => {
//     try {
//         // const studentAddress = req.body.studentAddress;
//         // const fileData = req.file.buffer;
//         // const filrName = req.file.originalname
//         // const { cid } = await ipfs.add(fileData, { onlyHash: true });
// console.log(req.file.path)

//         const filePath = path.resolve(req.file.path);
//     const fileData = await fs.readFile(filePath);
//     const file = new File([fileData], req.file.originalname, { type: req.file.mimetype });
//     const metadata = await client.store({
//       name: req.body.name || 'Example NFT',
//       description: req.body.description || 'Example NFT Description',
//       image: file,
//     });

//         const student = await studentModel.findOne({ studentAddress: studentAddress });
//         const existingHash = student.documentHash.find(hashObj => hashObj.hash === metadata.ipnft.toString());

//         if (existingHash) {
//             console.log('File already exists in IPFS. CID:', cid.toString());
//             return res.status(400).json({ error: 'File already exists' });
//         }

//         // If the hash does not exist, add it to the documentHash array
//         // const result = await ipfs.add(fileData);
//         const hashData = {
//             fileName: filrName,
//             hash: metadata.ipnft.toString()
//         };
//         student.documentHash.push(hashData);
//         await student.save();

//         console.log('File uploaded to IPFS. CID:', cid.toString());
//         res.status(200).json({ cid: cid.toString() });
        
//     } catch (error) {
//         console.error('Error uploading file to IPFS:', error);
//         res.status(500).json({ error: 'Failed to upload file to IPFS' });
//     }
// });

router.post('/uploadToIPFS', upload.single('studentDocument'), async (req, res) => {
    const studentAddress = req.body.studentAddress; // Ensure you have this field in the form
    const { originalname: fileName, path: tempFilePath, mimetype } = req.file;

    try {
        const fileData = await fs.promises.readFile(tempFilePath);

        // Convert file data to a File object
        // const file = new File([fileData], fileName, { type: mimetype });
        
        // // Store metadata and file in NFT.Storage
        // const metadata = await client.store({
        //     name: req.body.name || 'Example NFT',
        //     description: req.body.description || 'Example NFT Description',
        //     image: file,
        // });

        // const cid = metadata.ipnft.toString();


        const upload = await storage.upload(fileData)
        // console.log(upload.slice(7))
        const cid = upload.slice(7)
        console.log(`Gateway URL - ${storage.resolveScheme(upload)}`);
        const student = await studentModel.findOne({ studentAddress: studentAddress });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const existingHash = student.documentHash.find(hashObj => hashObj.hash === cid);
        if (existingHash) {
            console.log('File already exists in IPFS. CID:', cid);
            return res.status(400).json({ error: 'File already exists' });
        }

        const hashData = {
            fileName: fileName,
            hash: cid
        };

        student.documentHash.push(hashData);
        await student.save();

        console.log('File uploaded to IPFS. CID:', cid);
        res.status(200).json({ cid: cid });

    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        res.status(500).json({ error: 'Failed to upload file to IPFS' });
    } finally {
        // Cleanup temporary file
        fs.unlink(tempFilePath, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
        });
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