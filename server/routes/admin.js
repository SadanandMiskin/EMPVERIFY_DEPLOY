const contract = require('../controllers/contract')

const express = require('express')
const { Auth } = require('../middleware/Auth')
const router = express.Router()

// const contract = require()
router.get('/addUniversity', async(req,res)=>{
  const signerAddress = req.session.account;
  
    console.log('Signer Address:', signerAddress);
    if (String(signerAddress).toLowerCase() == String(process.env.ADMIN_ADDRESS).toLowerCase()) {
        res.render('admin');
    } else {
        res.json({message: 'You arent admin'});
    }
})


router.post('/addUniversity', async (req, res) => {
    const { universityName, universityWalletAddress, universityLicenseNumber, approvedByGov , account} = req.body;
    console.log(req.body)
    const ApprovedByGov = String(approvedByGov).toLowerCase() === 'true';
  
    try {
      const adminAddress = process.env.ADMIN_ADDRESS;
  
      // Check if user address matches admin address (server-side validation)
    //   if (userAddress !== adminAddress) {
    //     return res.status(403).json({ message: 'Not authorized (admin only)' });
    //   }
        console.log(adminAddress)
        console.log(account)
        // if(account!= adminAddress){
        //     return res.json('Not admionin') 
        // }
        if(account.toLowerCase() == adminAddress.toLowerCase()) {
            const universityAdded = await contract.methods.addUniversity(universityName, universityWalletAddress, universityLicenseNumber, ApprovedByGov).send({
                from: adminAddress,
                gas: 1000000,
                gasPrice: 10000000000,
              });
          
              console.log(universityAdded.events.UniversityAdded);
              res.json({ message: 'University added successfully!' });
        }
        else{
            res.json('no  admionn')
        }
  
     
  
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Error adding university' });
    }
  });
module.exports = router