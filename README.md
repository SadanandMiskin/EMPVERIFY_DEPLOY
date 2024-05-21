<h6>This repository is the Deployed version. To run the application locally <a href="https://github.com/kuldeepkumar2212/EMPVERIFY">Click Here</a>.</h6>

![logo](https://github.com/SadanandMiskin/EMPVERIFY/assets/119523972/82d6731a-401b-47f9-81cc-9d9fec1cfbcf)

<p>EMPVERIFY is a  platform which allows Document verification of the Employee which is added by his/her organization by Verifier powered by Blockchain</p>


## Technologies used 
<img height="50" src="https://user-images.githubusercontent.com/25181517/182884177-d48a8579-2cd0-447a-b9a6-ffc7cb02560e.png"> <img height="50" src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png"><img height="50" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png"> <img height="50" src="https://github.com/SadanandMiskin/EMPVERIFY/assets/119523972/b72e05b0-052a-4a1e-b7b1-2a92c2efff57"> <img height="50" src="https://github.com/SadanandMiskin/EMPVERIFY/assets/119523972/fd6cd0cf-1dc0-455b-91b4-16bcc7906f75"><img height="50" src="https://github.com/SadanandMiskin/EMPVERIFY/assets/119523972/9bb85c4b-d67c-41ea-bf87-b9d87ee5daa2"> <img height="50" src="https://github.com/SadanandMiskin/EMPVERIFY/assets/119523972/9123ac80-d7ce-4f95-b19d-e1b2681071be"> 


- MongoDB: A NoSQL database used for storing data.
- Express: A web application framework for Node.js used for building the server-side application.
- Node.js: A JavaScript runtime used for executing JavaScript code on the server-side.
- Ganache: A personal blockchain for Ethereum development used for testing and deploying smart contracts.
- IPFS: A peer-to-peer file sharing protocol used for storing and sharing files.
- Metamask: A browser extension used for interacting with the Ethereum blockchain.
- Solidity: Writing Smart contracts on Ethereum Blockchain.


## Working 
![image](https://github.com/SadanandMiskin/EMPVERIFY/assets/119523972/867de8ef-d818-4a6d-ab96-c62afa023b51) ![image](https://github.com/SadanandMiskin/EMPVERIFY_DEPLOY/assets/119523972/e6d17b64-bf38-44a4-ba8c-f82ce735f8da)





## Setup

1. Clone the repository: `https://github.com/kuldeepkumar2212/EMPVERIFY`

2. Open `Ganache` and create a new Project

3. Install MetaMask in browser and import the local blockchain network details from 'Ganache'
 - ( Top Left Corner > Add Network > Add netwotk Manually > Add `RPC URL` link (from Ganache) > save > Switch to the Ganache network)
4. Import Required accounts from Ganache to MetaMask (required)

5. Open terminal and run `ipfs daemon`

6. Install dependencies:
    `npm install`
   
7.  Compile the contract using:
    - `npm run compile`
- (Copy the created contract address from "Transactions" tab in `Ganache` and paste in .env)
    
8. Create a `.env` file in the root directory and add the following variables:
- as of `.env-example` 
   
4. Run the development server:
   - `npm run dev`

5. Access the application:
Server running on `http://localhost:3000` 



## Usage
- Admin logins and able to add Organizations.
- Once when admin adds organization only then organization can login (No self registration).
- Then Orgs can add its Employees and their documents where documents are saved in IPFS with corresponding employee detail.
- (No self Registration for Employee) Employee can view his/her documents in profile and check for any requests for docs by verifier.
- Verfier register himself and then using wallet address of the employee the verifier can request  required documents for that particulat employee.
- Employee can able to Accept or Revoke the request by verifier
- The document Link shared to verifier is a `Temporary Link` and after `Revoked` by employeee the link will be expired.
