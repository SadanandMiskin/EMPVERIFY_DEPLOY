// const express = require('express');
const {Web3} = require('web3');
const fs = require('fs');
// const path = require('path')
require('dotenv').config()
// let cors = require("cors");

const INFURA_PROJECT_ID = process.env.PROJECT_ID;
const SEPOLIA_ENDPOINT = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;

const contractAddress = process.env.CONTRACT_ADDRESS; 
// console.log(contractAddress)
const contractData = JSON.parse(fs.readFileSync('./build/contracts/BGV.json', 'utf8'));
const contractABI = contractData.abi;

const web3 = new Web3(new Web3.providers.HttpProvider(SEPOLIA_ENDPOINT)); // Change to the URL of your Ethereum node
const contract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = contract