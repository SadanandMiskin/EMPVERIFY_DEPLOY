// const initMetamask = async () => {
//     // Check if MetaMask is installed
//     if (window.ethereum) {
//         try {
//             // Request user accounts from MetaMask
//             const accounts = await window.ethereum.request({
//                 method: "eth_requestAccounts",
//             });
//             // Handle account change
//             handleAccountsChanged(accounts);
//         } catch (err) {
//             console.error("Error occurred while requesting accounts:", err);
//         }
//     } else {
//         console.log("MetaMask not installed.");
//     }
// };

// // Function to handle MetaMask accounts change
// const handleAccountsChanged = async (accounts) => {
//     if (accounts.length === 0) {
//         console.log("MetaMask not connected.");
//     } else {
//         console.log("MetaMask connected. Account:", accounts[0]);
//         // Run other MetaMask related code here
//         // For example, update UI or interact with contract
//     }
// };

// // Function to initialize MetaMask provider and event listeners
// const initMetamaskProvider = async () => {
//     await initMetamask();
//     // Listen for MetaMask accounts change
//     window.ethereum.on("accountsChanged", handleAccountsChanged);
// };

// // Call the function to initialize MetaMask
// initMetamaskProvider();

// // Add event listener to the form submit button
// document.querySelector('form').addEventListener('submit', async function(event) {
//     event.preventDefault();
//     // Call function to open MetaMask and connect
//     await initMetamask();
    
//     // Request user's approval in MetaMask
//     try {
//         const accounts = await window.ethereum.request({
//             method: "eth_requestAccounts",
//         });
        
//         // Get form data
//         const universityName = document.getElementById('universityName').value;
//         const universityWalletAddress = document.getElementById('universityWalletAddress').value;
//         const universityLicenseNumber =  document.getElementById('universityLisence').value;
//         const approvedByGov = document.getElementById('universityApprove').value;

//         // Send form data to server using fetch
//         const universityAdded = await fetch('/addUniversity', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 universityName,
//                 universityWalletAddress,
//                 universityLicenseNumber,
//                 approvedByGov,
//                 account: accounts[0] // Pass the user's Ethereum account
//             })
//         });

//         // console.log(universityAdded);
//     } catch (error) {
//         console.error(error);
//     }
// });



let contractABI 
let contract
let contractInstanceCall
const fetchABIAndContractAddress = async() =>{
    
    try {
        const response = await fetch('/abi', {
            method: 'POST'
        });
        console.log(response)
        const { abi, contractAddress } = await response.json();
        contractABI = abi;
        contract = contractAddress
    } catch (error) {
        console.error('Error fetching ABI:', error);
    }
   
}

async function createContractInstance() {
    try {
        await fetchABIAndContractAddress();
        if (contractABI) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();
            const signer = provider.getSigner(accounts[0]);
            contractInstanceCall = new ethers.Contract(
                contract,
                contractABI,
                signer
            );
            console.log('Contract instance created:', contractInstanceCall);
        } else {
            console.error('ABI is undefined');
        }
    } catch (error) {
        console.error('Error creating contract instance:', error);
    }
}


document.getElementById('submit').addEventListener('click' ,async(event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
        // const contractInstance = await createContractInstance() 
        const universityName = document.getElementById('universityName').value;
        const universityWalletAddress = document.getElementById('universityWalletAddress').value;
        const universityLicenseNumber =  document.getElementById('universityLisence').value;
        var approvedByGov = document.getElementById('universityApprove').value;
        approvedByGov = String(approvedByGov).toLowerCase() === 'true'

        const res = await contractInstanceCall.addUniversity(universityName, universityWalletAddress, universityLicenseNumber, approvedByGov)
        console.log(res)

        
        
    } catch (error) {
        console.error(error)
    }
})

async function displayUniversities(){
    const universitiesList = document.getElementById('universities-list');
    // event.preventDefault();
    try {
        const list = await contractInstanceCall.getAllUniversities()
        console.log(list)
        list.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name}  ${item.universityAddress} ${item.licenseNumber} ${item.approvedByGovernment}`;
            universitiesList.appendChild(listItem);
        });
        
    } catch (error) {
        console.error(error)
    }
}

async function initializeApp() {
    await createContractInstance();
    await displayUniversities();
}

initializeApp();