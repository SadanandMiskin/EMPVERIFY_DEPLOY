const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const multer  = require('multer');

const app = express()
const verifierModel = require('../models/verifier');
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }))
const upload = multer();

const salt = 10;

router.get('/register', (req, res) => {
    res.render('register');
});


router.get('/login' , (req,res)=>{
    res.render('login')
})




router.post('/register',upload.none(), async (req, res) => {
    console.log(req.body)
    const { companyName, companyEmail, companyPassword } = req.body;

    try {
        const existingVerifier = await verifierModel.findOne({ email: companyEmail });
        if (existingVerifier) {
            return res.status(400).redirect('/register');
        }

        const hash = await bcrypt.hash(companyPassword, salt);
        const verifier = await verifierModel.create({
            name: companyName,
            email: companyEmail,
            password: hash
        });
        console.log('created:', verifier);
        res.json('/login');
    } catch (err) {
        console.error(err);
        res.status(500).redirect('/register');
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const verifier = await verifierModel.findOne({ email: email });
        if (!verifier) {
            return res.status(400).redirect('/login');
        }

        const match = await bcrypt.compare(password, verifier.password);
        if (!match) {
            return res.redirect('/login');
        }
        req.session.account = email
        res.redirect('/verifierHome')
    } catch (err) {
        console.error(err);
        res.status(500).redirect('/login');
    }
});







module.exports = router;

 
