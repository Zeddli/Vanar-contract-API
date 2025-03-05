const express = require("express");
const { ethers } = require("ethers");
const path = require("path");

// Load .env file from the project root
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

console.log("Environment variables loaded from:", path.resolve(__dirname, "../.env"));
console.log("PRIVATE_KEY exists:", !!process.env.PRIVATE_KEY);
console.log("VANAR_RPC_URL exists:", !!process.env.VANAR_RPC_URL);

// Check required environment variables
const requiredEnvVars = ['PRIVATE_KEY', 'VANAR_RPC_URL'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const app = express();
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.VANAR_RPC_URL);
const privateKey = process.env.PRIVATE_KEY?.trim();

if (!privateKey) {
    throw new Error("PRIVATE_KEY is missing in environment variables");
}

console.log("Initializing wallet...");
const wallet = new ethers.Wallet(privateKey.startsWith("0x") ? privateKey : "0x" + privateKey, provider);

const contractABI = [
    {
        "inputs": [
          {
            "internalType": "string",
            "name": "_record",
            "type": "string"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "getRecord",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
]; // ABI of the deployed contract

app.post("/deploy", async (req, res) => {
    try {
        const Contract = new ethers.ContractFactory(
            contractABI,
            bytecode, // from compiled contract
            wallet
        );

        const contract = await Contract.deploy(req.body.record);
        await contract.waitForDeployment();

        res.json({ address: contract.target });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
