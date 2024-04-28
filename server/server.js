const admin = require('./routes/admin.js')
const contract = require('./controllers/contract.js')
const check = require('./routes/check.js')
const university = require('./routes/university.js')
const student = require('./routes/student.js')
const verifierHome = require('./routes/verifierRegistration.js')
const verifier = require('./routes/verifier.js')

require('dotenv').config()
const express = require('express');
const {  Web3 } = require('web3');
const fs = require('fs');
const path = require('path')
const cors = require("cors");
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session  =require('express-session')
const { db } = require('./config/db.js')


// const contractAddress = process.env.COTRACT_ADDRESS; // Replace with the actual address of your deployed contract
// const contractData = JSON.parse(fs.readFileSync('./build/contracts/BGV.json', 'utf8'));
// const contractABI = contractData.abi;

const app = express();
app.use(cors());
app.use(cookieParser())
app.use(session({
    secret: 'sdjadkajlsbdhvadbsbandnsjjakdnksnnnknsfjjddsnj',
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //     expires: 60000
    // }
}));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../', 'client', 'views'));
app.use(express.static(path.join(__dirname, '../', 'client')));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Load the contract instance
// const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545')); // Change to the URL of your Ethereum node
// const contract = new web3.eth.Contract(contractABI, contractAddress);

// Define a route to interact with the contract

app.use('/', admin)
app.use('/', check)
app.use('/', university)
app.use('/', student)
app.use('/',verifierHome)
app.use('/' , verifier)

app.post('/abi', (req, res) => {
    console.log(path.join(__dirname, '../build/contracts/BGV.json'))
    const contractData = JSON.parse(fs.readFileSync('./build/contracts/BGV.json', 'utf8'));
    const contractABI = contractData.abi;
    const contractAddress = process.env.CONTRACT_ADDRESS
    res.json({
        abi: contractABI,
        contractAddress: contractAddress
    })
})



//homepage for connection for metamask
app.get('/', (req, res) => {

    res.render('home')
})

// app.get('/contract', async (req, res) => {
//     res.render('index')
// })

// app.post('/contract', async (req, res) => {
//     try {
//         var user_address = '0x4ec106BF6fDD38AD17Bc1AAa92A92c293487d663';
//         // Example: Call a contract function
//         const result = await contract.methods.getDocumentCount(user_address).call();
//         console.log(result); // Need to add .call() to execute the function
//         res.json({
//             documentCount: result.toString()
//         }); // Send the result back as JSON
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({
//             error: 'Internal server error'
//         });
//     }
// });


const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await db()
    console.log(`Server is running on http://localhost:${PORT}`);
});