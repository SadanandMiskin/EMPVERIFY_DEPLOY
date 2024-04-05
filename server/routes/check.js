const express= require('express')
const { setSignerAddress } = require('../middleware/Auth')
const contract = require('../controllers/contract')
const router = express.Router()


router.post('/check', setSignerAddress, async(req, res) => {
    const { signerAddress } = req.body;
    const adminAddress = process.env.ADMIN_ADDRESS.toLowerCase();
    
    try {
        req.session.account = signerAddress;

        const account = signerAddress.toLowerCase();
        const accountAddress = await contract.methods.getAllUniversities().call();
        
        const universityAddress = accountAddress.find(item => item.universityAddress.toLowerCase() === account);
        
        if (universityAddress && universityAddress.universityAddress.toLowerCase() === account && universityAddress.universityAddress.toLowerCase() !== adminAddress) {
            req.session.university = account;
            return res.json({ redirectTo: '/addStudent', message: '' });
        }

        else if (account === adminAddress) {
            return res.json({ redirectTo: '/addUniversity', message: '' });
        }
        else {
            return res.json({redirectTo: '/', message: 'Not authorized, Contact Admin or your Organization to add you :)'})
        }
         
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router