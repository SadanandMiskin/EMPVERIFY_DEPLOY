const universityModel = require("../models/university");
const verifierModel = require("../models/verifier");

function Auth(req,res,next) {
   
}

function setSignerAddress(req, res, next) {
    const { signerAddress } = req.body;
    req.session.account = signerAddress;
    // console.log(req.address)
    next();
} 

async function isUniversity(req,res,next){
try {
    const university = await universityModel.findOne({universityAddress: req.session.account})
    if(!university) {
        return res.redirect('/')
    }
    next()
} catch (error) {
    console.error(error)
}
}

async function isVerifier(req,res,next){
    try {
    const verifier = await verifierModel.findOne({email: req.session.account})
    if(!verifier) {
        return res.redirect('/login')
    }
    next()
    } catch (error) {
        console.error(error)
    }
}

function routerAuth(req,res,next) {
    if(!req.session.account) {
        return res.redirect('/')
    }
    else{
        return next()
    }
}

module.exports = {Auth, setSignerAddress, routerAuth, isUniversity, isVerifier}