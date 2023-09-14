// Function to get balance of a Bitcoin address
async function getBalance(address) {
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
