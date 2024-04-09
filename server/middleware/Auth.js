function Auth(req,res,next) {
   
}

function setSignerAddress(req, res, next) {
    const { signerAddress } = req.body;
    req.session.account = signerAddress;
    // console.log(req.address)
    next();
} 

function routerAuth(req,res,next) {
    if(!req.session.account) {
        return res.json({error: 'PLease login'})
    }
    else{
        return next()
    }
}

module.exports = {Auth, setSignerAddress, routerAuth}