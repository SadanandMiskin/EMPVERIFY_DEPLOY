// const express = require('express');
const { ethers } = require('ethers');

const fs = require('fs');
require('dotenv').config();

const contractAddress = process.env.CONTRACT_ADDRESS; 
const contractData = JSON.parse(fs.readFileSync('./build/contracts/BGV.json', 'utf8'));
const contractABI = contractData.abi;

// Connect to Ganache (assuming it's running on localhost:7545)
const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');
// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);
module.exports = { contract, contractABI, provider, contractAddress };
