function Auth(req,res,next) {
   
}

function setSignerAddress(req, res, next) {
    const { signerAddress } = req.body;
    req.session.account = signerAddress;
    // console.log(req.address)
    next();
}


module.exports = {Auth, setSignerAddress}