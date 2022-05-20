const { ethers } = require("hardhat");



module.exports = async ({
    deployments,
    getNamedAccounts
}) => {
    const {deploy, log} = deployments;
    const { deployer } = await getNamedAccounts();

    const BoxContract = await deploy("Box", {
        from: deployer,
        logs: true
    })

    log(`Box Contract deployed to: ${BoxContract.address}`)


    // But now we have to change the ownership of box contract from deployer to timelock contract

    const Box = await ethers.getContractAt("Box", BoxContract.address);
    const timelock = await ethers.getContract("TimeLock");

    const tx = await Box.transferOwnership(timelock.address);
    await tx.wait(1);
    log(`Ownership of box contract is tranferred to Timelock contract`);

}

module.exports.tags = ["all", "box"];