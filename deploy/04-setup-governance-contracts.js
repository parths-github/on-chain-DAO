// We want our governance contrcat to be the owner of contract, not the person who deployed it
// And also want to set some other roles
const { ethers } = require("hardhat");
const { helper } = require("../helper-hardhat-config");


module.exports = async ({
    deployments,
    getNamedAccounts
}) => {
    const {deploy, log, get} = deployments;
    const {deployer} = await getNamedAccounts();

    // Deployer will be the signer to that contrcat
    const governanceToken = await ethers.getContract("GovernanceToken", deployer);
    const timelock = await ethers.getContract("TimeLock", deployer);
    const governor = await ethers.getContract("GovernorContract", deployer);
    log(`Setting up governance roles..`);  

    const proposalRole = await timelock.PROPOSER_ROLE();
    const executorRole = await timelock.EXECUTOR_ROLE();
    const adminRole = await timelock.TIMELOCK_ADMIN_ROLE();


    // Giving proposal role to governor contrcat
    const proposalTx = await timelock.grantRole(proposalRole, governor.address);
    await proposalTx.wait(1);

    // Address 0 means everyone
    const executorTx = await timelock.grantRole(executorRole, helper.ADDRESS_ZERO);
    await executorTx.wait(1);


    // revoking admin role from deployer
    const revokeTx = await timelock.grantRole(adminRole, deployer);
    await revokeTx.wait(1);

    log(`Roles setup...deployer is no longer admin of Timelock contract`)



}