document.addEventListener('DOMContentLoaded', function() {
    const fetchDataBtn = document.getElementById('fetchDataBtn');
    const outputDiv = document.getElementById('output');
    

    fetchDataBtn.addEventListener('click', async function() {
        try {
            const response = await fetch('http://localhost:3000/contract',{
                method: "POST"
            }); // Assuming your server is running on port 3000
            console.log(response)
            const data = await response.json();
            outputDiv.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            outputDiv.textContent = 'Error fetching data: ' + error.message;
        }
    });
});
