
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

    const companyName = document.getElementById('companyName').value
    const companyEmail = document.getElementById('companyEmail').value
    const companyPassword = document.getElementById('companyPassword').value

    console.log(companyName)
    // const studentWalletAddress = document.getElementById('studentWalletAddress').value

    

    try {
    //     if(String(signerAdd).toLowerCase() == String(studentWalletAddress).toLowerCase()){
    //     console.log('University cant add itself as student')
    // }else {
        
        // const universities = await contractInstanceCall.getAllUniversities()
        // console.log(universities)
        // const universityExists = universities.filter((item) => {return item.universityAddress == studentWalletAddress})
        // console.log(universityExists)
        // if(!universityExists) {
        //     console.log('Student wallet cannot be some university wallet')
        // }

        // else{
            const form = document.getElementById('registerForm');
            const formData = new FormData(form);
// formData.append('companyName', companyName);
// formData.append('companyEmail', companyEmail);
// formData.append('companyPassword', companyPassword);
            
        const res = await contractInstanceCall.addVerifier(companyName)
        

        
        const studentAdd = await fetch('/register' , {
            method:'POST',
            body: formData
               
            

        })
        // const universityAddress = res.from
        
        console.log('added verifier' , studentAdd)
        console.log(res)
        window.location.href = '/login'
        }
    // }
    // }
     catch (error) {
        document.getElementById('hhhh').style.backgroundColor = 'red'
        document.getElementById('hhhh').textContent = 'Already Exists with this Meta Mask Account'
        console.error(error)
    }
})

// const documentUploadForm = ;


async function initializeApp() {
    await createContractInstance();
    // await displayUniversities();
}

initializeApp();