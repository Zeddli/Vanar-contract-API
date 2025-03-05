const hre = require("hardhat");

async function main() {
    const HealthRecord = await hre.ethers.getContractFactory("HealthRecord");
    const contract = await HealthRecord.deploy("Initial Health Record");

    await contract.deployed();
    console.log(`Contract deployed to: ${contract.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
