
let contractABI 
let contract
let contractInstanceCall
let signerAdd
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
            signerAdd = await signer.getAddress()
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

document.getElementById('submit').addEventListener('click' ,async(event)=>{
    event.preventDefault()

    const studentName = document.getElementById('studentName').value
    const studentWalletAddress = document.getElementById('studentWalletAddress').value

    

    try {
        if(String(signerAdd).toLowerCase() == String(studentWalletAddress).toLowerCase()){
        console.log('University cant add itself as student')
    }else {
        
        const universities = await contractInstanceCall.getAllUniversities()
        console.log(universities)
        const universityExists = universities.filter((item) => {return item.universityAddress == studentWalletAddress})

        if(universityExists) {
            console.log('Student wallet cannot be some university wallet')
        }

        else{
            
        const res = await contractInstanceCall.addStudent(studentName , studentWalletAddress)
        // const universityAddress = res.from
        const form = document.getElementById('studentform');
        const formData = new FormData(form);
        const studentAdd = await fetch('/addStudent' , {
            method:'POST',
            body: formData
               
            

        })
        console.log('added student' , studentAdd)
        console.log(res)
        }
    }
    } catch (error) {
        console.error(error)
    }
})

async function initializeApp() {
    await createContractInstance();
    // await displayUniversities();
}

initializeApp();