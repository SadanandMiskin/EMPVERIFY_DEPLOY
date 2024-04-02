const initMetamask = async () => {
    // Check if MetaMask is installed
    if (window.ethereum) {
        try {
            // Request user accounts from MetaMask
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            // Handle account change
            handleAccountsChanged(accounts);
        } catch (err) {
            console.error("Error occurred while requesting accounts:", err);
        }
    } else {
        console.log("MetaMask not installed.");
    }
};

// Function to handle MetaMask accounts change
const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
        console.log("MetaMask not connected.");
    } else {
        console.log("MetaMask connected. Account:", accounts[0]);
        // Run other MetaMask related code here
        // For example, update UI or interact with contract
    }
};

// Function to initialize MetaMask provider and event listeners
const initMetamaskProvider = async () => {
    await initMetamask();
    // Listen for MetaMask accounts change
    window.ethereum.on("accountsChanged", handleAccountsChanged);
};

// Call the function to initialize MetaMask
initMetamaskProvider();

// Add event listener to the form submit button
document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();
    // Call function to open MetaMask and connect
    await initMetamask();
    
    // Request user's approval in MetaMask
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        
        // Get form data
        const universityName = document.getElementById('universityName').value;
        const universityWalletAddress = document.getElementById('universityWalletAddress').value;
        const universityLicenseNumber =  document.getElementById('universityLisence').value;
        const approvedByGov = document.getElementById('universityApprove').value;

        // Send form data to server using fetch
        const universityAdded = await fetch('/addUniversity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                universityName,
                universityWalletAddress,
                universityLicenseNumber,
                approvedByGov,
                account: accounts[0] // Pass the user's Ethereum account
            })
        });

        console.log(universityAdded);
    } catch (error) {
        console.error(error);
    }
});
