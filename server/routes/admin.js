const contract = require('../controllers/contract')
const { Auth } = require('../middleware/Auth')

const express = require('express')
const multer = require('multer')
const universityModel = require('../models/university')

const router = express.Router() 


const upload = multer();


// const contract = require()
router.get('/addUniversity', async(req,res)=>{
  const signerAddress = req.session.account;
  
    console.log('Signer Address:', signerAddress);
    try {
      if (String(signerAddress).toLowerCase() == String(process.env.ADMIN_ADDRESS).toLowerCase()) {
        const contractDetails = await contract.methods.getAllUniversities().call()
        const allLogo = await universityModel.find()
          console.log('created ', contractDetails)
          // res.json(allLogo)
          res.render('admin', {mongoDetails: allLogo , contractDetails: contractDetails});
      } else {
          return res.redirect('/')
      }
    } catch (error) {
      console.error(error)
    }
})


router.post('/addUniversity', upload.single("universityLogo"), async (req, res) => {

  try {
    const { universityName, universityWalletAddress, universityLicenseNumber } = req.body;
        const logoData = req.file.buffer;

       const result=  await universityModel.create({
        universityName: universityName,
          universityAddress: universityWalletAddress,
          logo: logoData

        })
      const allLogo = await universityModel.find()
        console.log('created ', allLogo)
        res.json(allLogo)
  } catch (error) {
    console.error(error)
  }

    // const { universityName, universityWalletAddress, universityLicenseNumber, approvedByGov , account} = req.body;
    // console.log(req.body)
    // const ApprovedByGov = String(approvedByGov).toLowerCase() === 'true';
  
    // try {
    //   const adminAddress = process.env.ADMIN_ADDRESS;
  
    //   // Check if user address matches admin address (server-side validation)
    // //   if (userAddress !== adminAddress) {
    // //     return res.status(403).json({ message: 'Not authorized (admin only)' });
    // //   }
    //     console.log(adminAddress)
    //     console.log(account)
    //     // if(account!= adminAddress){
    //     //     return res.json('Not admionin') 
    //     // }
    //     if(account.toLowerCase() == adminAddress.toLowerCase()) {
    //         const universityAdded = await contract.methods.addUniversity(universityName, universityWalletAddress, universityLicenseNumber, ApprovedByGov).send({
    //             from: adminAddress,
    //             gas: 1000000,
    //             gasPrice: 10000000000,
    //           });
          
    //           console.log(universityAdded.events.UniversityAdded);
    //           res.json({ message: 'University added successfully!' });
    //     }
    //     else{
    //         res.json('no  admionn')
    //     }
  
     
  
    // } catch (err) {
    //   console.error('Error:', err);
    //   res.status(500).json({ message: 'Error adding university' });
    // }
  });


//   router.get('/university/:address', async (req, res) => {
//     try {
//         const address = req.params.address.toLowerCase(); // Get the address from the request parameters
//         const university = await University.findOne({ universityAddress: address }); // Find the university in MongoDB by its address
//         if (!university) {
//             return res.status(404).json({ error: 'University not found' });
//         }
//         res.json(university); // Send the university data as JSON response
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

module.exports = router