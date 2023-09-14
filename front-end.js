// Function to get balance of a Bitcoin address
async function getBalance() {
    const address = document.getElementById('address').value;
    try {
        const response = await fetch(`https://blockchain.info/q/addressbalance/${address}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const balanceInSatoshis = await response.text();
        const balanceInBitcoins = balanceInSatoshis / 1e8;
        document.getElementById('balance').textContent = `Balance: ${balanceInBitcoins} BTC`;
    } catch (error) {
        console.error(`There was an error fetching the balance: ${error.message}`);
        document.getElementById('balance').textContent = `Error: ${error.message}`;
    }
}

// Function to get latest Bitcoin price in USD
async function getPrice() {
    try {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const price = data.bpi.USD.rate_float;
        document.getElementById('price').textContent = `Latest Price: $${price}`;
    } catch (error) {
        console.error(`There was an error fetching the price: ${error.message}`);
        document.getElementById('price').textContent = `Error: ${error.message}`;
    }
}

// Function to calculate value of a certain amount of Bitcoin in USD
async function calculateValue() {
    try {
        const amount = document.getElementById('amount').value;
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const price = data.bpi.USD.rate_float;
        const value = amount * price;
        document.getElementById('value').textContent = `Value: $${value.toFixed(2)}`;
    } catch (error) {
        console.error(`There was an error calculating the value: ${error.message}`);
        document.getElementById('value').textContent = `Error: ${error.message}`;
    }
}

// Function to convert USD to Bitcoin
async function convertUsdToBtc(usd) {
    try {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const price = data.bpi.USD.rate_float;
        const btc = usd / price;
        document.getElementById('conversion').textContent = `$${usd} is worth ${btc.toFixed(8)} BTC`;
    } catch (error) {
        console.error(`There was an error converting USD to BTC: ${error.message}`);
        document.getElementById('conversion').textContent = `Error: ${error.message}`;
    }
}

// Function to toggle the visibility of the image
function toggleImage() {
    const image = document.getElementById('graphImage');
    if (image.style.display === 'none') {
        image.style.display = 'block';
    } else {
        image.style.display = 'none';
    }
}
