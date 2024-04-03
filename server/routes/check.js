const express= require('express')
const { setSignerAddress } = require('../middleware/Auth')
const router = express.Router()

router.post('/check' ,setSignerAddress, async(req,res)=>{
    const {signerAddress} = req.body
    try {
        req.session.account = signerAddress
        const adminAddress = String(process.env.ADMIN_ADDRESS).toLowerCase();
        const account = String(signerAddress).toLowerCase()
        console.log(account)
        
        if(account == adminAddress){
            return res.json({redirectTo: '/addUniversity' })
        }
         
        else {
            // return res.json({
            //     auth: false
            // })
            return res.json({redirectTo: '/'})
        }
    
    } catch (err) {
        console.error(err)
    }

})

module.exports = router