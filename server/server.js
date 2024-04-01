const express = require('express');
const {Web3} = require('web3');
const fs = require('fs');
let cors = require("cors");



const contractAddress = '0xdee9866097C80afBC41082780cB2cEb6ddCE9EfE'; // Replace with the actual address of your deployed contract
const contractData = JSON.parse(fs.readFileSync('./build/contracts/BGV.json', 'utf8'));
const contractABI = contractData.abi;
const app = express();
app.use(cors());

// Define a route to handle GET requests
app.get('/', (req, res) => {
    res.send('Hello, World!');
});


// Load the contract instance
const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545')); // Change to the URL of your Ethereum node
const contract = new web3.eth.Contract(contractABI, contractAddress);


// Define a route to interact with the contract
app.post('/contract', async (req, res) => {
    try {
        var user_address = '0x7f694bb5b2b4e33e83192a2a25167141dF42547f';
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
