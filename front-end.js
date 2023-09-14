// Function to get balance of a Bitcoin address
async function getBalance(address) {
    const response = await fetch(`https://blockchain.info/q/addressbalance/${address}`);
    const balance = await response.text();
    return balance;
}
