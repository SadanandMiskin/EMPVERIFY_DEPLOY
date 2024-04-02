const admin = require('./routes/admin.js')
const contract = require('./controllers/contract.js')

const express = require('express');
const {Web3} = require('web3');
const fs = require('fs');
const path = require('path')
require('dotenv').config()
let cors = require("cors");



// const contractAddress = process.env.COTRACT_ADDRESS; // Replace with the actual address of your deployed contract
// const contractData = JSON.parse(fs.readFileSync('./build/contracts/BGV.json', 'utf8'));
// const contractABI = contractData.abi;

const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../', 'client', 'views'));
app.use(express.static(path.join(__dirname,'../', 'client')));
app.use(express.json())


// Load the contract instance
// const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545')); // Change to the URL of your Ethereum node
// const contract = new web3.eth.Contract(contractABI, contractAddress);

// Define a route to interact with the contract

app.use('/', admin)

//homepage for connection for metamask
app.get('/' , (req,res)=>{
    console.log(contract)
    res.render('home')
})

app.get('/contract' , async(req,res)=>{
    res.render('index')
})

app.post('/contract', async (req, res) => {
    try {
        var user_address = '0x4ec106BF6fDD38AD17Bc1AAa92A92c293487d663';
        // Example: Call a contract function
        const result = await contract.methods.getDocumentCount(user_address).call();
        console.log(result); // Need to add .call() to execute the function
        res.json({ documentCount: result.toString() }); // Send the result back as JSON
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
