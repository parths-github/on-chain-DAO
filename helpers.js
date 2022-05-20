const { network } = require("hardhat")

async function moveBlocks(number) {
    for (let i = 0; i < number; i++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        });
    }

    console.log(`Moved ${number} blocks`);
}

async function moveTime(amount) {
    await network.provider.send("evm_increaseTime", [amount]);
    console.log(`Moved forwar in time ${amount} second`);
}

module.exports = {moveTime, moveBlocks }