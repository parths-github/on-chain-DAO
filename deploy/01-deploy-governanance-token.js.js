const { ethers } = require("hardhat");



module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {
    const {deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();

    log("Deploying...")
    const GovernanceToken = await deploy("GovernanceToken", {
        from: deployer,
        log: true
        // waitConfirmations : 5
    });

    log(`GovernanceToken deployed to: ${GovernanceToken.address}`);

    const governanceToken = await ethers.getContractAt("GovernanceToken", GovernanceToken.address);
    // In order to get the voting power we have delegate is to either ourselves or to any other address
    const tx = await governanceToken.delegate(deployer);
    await tx.wait(1);
    log(`${ await governanceToken.numCheckpoints(deployer)}`);


}

module.exports.tags = ["all", "governancetoken"];