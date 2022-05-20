const { helper } = require("../helper-hardhat-config");

module.exports = async ({
    deployments,
    getNamedAccounts
}) => {
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const args = [helper.MIN_DELAY, helper.PROPSERS, helper.EXECUTORS];
    const Timelock = await deploy("TimeLock", {
        from: deployer,
        logs: true,
        args: args
    })

    log(`TimeLock contract deployed to: ${Timelock.address}`)


}

module.exports.tags = ["all", "timelock"];