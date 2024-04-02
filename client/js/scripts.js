// const connectMetamask = document.getElementById('metamask')
// connectMetamask.addEventListener('click' ,()=>{

// })
document.addEventListener('DOMContentLoaded', async function() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum); 

        // Connect to MetaMask
        document.getElementById('metamask').addEventListener('click', async () => {
            try {
                // Request account access if needed
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                // Accounts now exposed
                const accounts = await web3.eth.getAccounts();
                console.log('Connected to MetaMask:', accounts[0]);
                alert('Connected to MetaMask!');
            } catch (error) {
                console.error(error);
                alert('Failed to connect to MetaMask. Please check if MetaMask is installed and unlocked.');
            }
        });
    } else {
        alert('MetaMask is not installed. Please install MetaMask to use this website.');
    }
});