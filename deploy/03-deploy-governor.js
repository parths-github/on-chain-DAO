const { helper } = require("../helper-hardhat-config");



module.exports = async ({
    deployments,
    getNamedAccounts
}) => {
    const {deploy, log, get} = deployments;
    const {deployer} = await getNamedAccounts();

    const governanceToken = await get("GovernanceToken");
    const timelock = await get("TimeLock");

    const args = [governanceToken.address, timelock.address, helper.VOTING_DELAY, helper.VOTING_PERIOD, helper.QUORUM_PERCENTAGE];

    const GovernorContract = await deploy("GovernorContract", {
        from: deployer,
        logs: true,
        args: args
    })

    log(`GovernorContract deployed to: ${GovernorContract.address}`);

    
}

module.exports.tags = ["all", "governor"];