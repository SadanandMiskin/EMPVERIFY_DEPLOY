// document.addEventListener('DOMContentLoaded', async function() {
//     if (typeof window.ethereum !== 'undefined') {
//         // Connect to MetaMask
//         document.getElementById('metamask').addEventListener('click', async () => {
//             try {
//                 // Request account access if needed
//                 const account = await ethereum.request({ method: 'eth_requestAccounts' });
//                 const provider = new ethers.providers.Web3Provider(window.ethereum);
//                 const signer = provider.getSigner();

//                 // Fetch contract ABI from the backend
//                 const resposnse = await fetch('/abi');
//                 const { abi } = await resposnse.json();

//                 // Replace contractAddress with your actual contract address
//                 const contractAddress = '0x123...'; // Replace this with your actual contract address

//                 const contract = new ethers.Contract(contractAddress, abi, signer);
//                 await contract.getAllUniversities()
//                 // Accounts now exposed
//                 const MetaMaskaccounts = account;
//                 const accounts = MetaMaskaccounts[0];

//                 const response = await fetch('/check', {
//                     method: "POST",
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         accounts
//                     })
//                 });
//                 const data = await response.json();
//                 console.log('Connected to MetaMask:', MetaMaskaccounts[0], data);
                
//                 // Redirect to '/addUniversity' upon successful connection
//                 if (response.ok) {
//                     window.location.href = data.redirectTo;
//                 }
//             } catch (error) {
//                 console.error(error);
//                 alert('Failed to connect to MetaMask. Please check if MetaMask is installed and unlocked.');
//             }
//         });
//     } else {
//         alert('MetaMask is not installed. Please install MetaMask to use this website.');
//     }
// });





// const MoodContractAddress = '0x23994bf12EEcF64A053E4395a25F1e59aE15B0d2';
let MoodContractAddress
let MoodContractABI;
let MoodContract; // Declare MoodContract variable here

async function fetchABI() {
    try {
        const response = await fetch('/abi', {
            method: 'POST'
        });
        const { abi, contractAddress } = await response.json();
        MoodContractABI = abi;
        MoodContractAddress = contractAddress

        console.log('MoodContractAddress', MoodContractAddress)
    } catch (error) {
        console.error('Error fetching ABI:', error);
    }
}

async function createContractInstance() {
    try {
        await fetchABI();
        if (MoodContractABI) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();
            const signer = provider.getSigner(accounts[0]);
            MoodContract = new ethers.Contract(
                MoodContractAddress,
                MoodContractABI,
                signer
            );
            console.log('Contract instance created:', MoodContract);
        } else {
            console.error('ABI is undefined');
        }
    } catch (error) {
        console.error('Error creating contract instance:', error);
    }
}

document.getElementById('metamask').addEventListener('click', async (event) => {
    event.preventDefault()
    // const mood = document.getElementById("mood").value;
//    const res = await MoodContract.addUniversity('dasds' , '0x7897aE8fD52D055430A59E51AbB904B65a63e437' ,'sd' , true);
//     console.log(res)

         const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();
            const signer = provider.getSigner(accounts[0]);
            const signerAddress = await signer.getAddress();
        try{
            const response = await fetch('/check', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'address': signerAddress
                                    },
                                    body: JSON.stringify({
                                        signerAddress
                                    })
                                });
                                const data = await response.json();
                                console.log('Connected to MetaMask:', signerAddress, data);
                                
                                // Redirect to '/addUniversity' upon successful connection
                                if (response.ok) {

                                    // await fetch('/addUniversity' , {
                                    //     method:'GET',
                                    //     headers:{
                                    //         'Content-Type': 'application/json',
                                    //         Authorization: signerAddress
                                    //     },
                                    //     // body: {
                                             
                                    //     // }

                                    // })
                                    
                                    window.location.href = `${data.redirectTo}?message=${encodeURIComponent(data.message)}`;
                                    console.log(data.message)
                                    document.getElementById('txt').textContent = data.message
                                    // alert(data.message)
                                    
                                }
                            } catch (error) {
                                console.error(error);
                                alert('Failed to connect to MetaMask. Please check if MetaMask is installed and unlocked.');
                            }
})
async function display() {
    const params = new URLSearchParams(window.location.search);
const message = params.get('message');
if (message) {
    document.getElementById('txt').textContent = message;
}
}

createContractInstance();
display()