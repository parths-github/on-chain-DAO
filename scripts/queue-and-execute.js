const {helper} = require("../helper-hardhat-config");
const fs = require("fs");
const { network, ethers } = require("hardhat");
const { moveTime, moveBlocks } = require("../helpers");


// function queue(
//     address[] memory targets,
//     uint256[] memory values,
//     bytes[] memory calldatas,
//     bytes32 descriptionHash



// ) public virtual override returns (uint256)
const main = async () => {
    // Getting the box contrcat to encode its fucntion
    const box = await ethers.getContract("Box");
    const functionData = box.interface.encodeFunctionData(helper.BOX.functionToCall, [helper.BOX.args]);
    // Coz it is accepted in bytes32 in quque fuction
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Proposal #1 Change the value"));

    const governor = await ethers.getContract("GovernorContract");
    console.log("Queueing...")
    const tx = await governor.queue([box.address], [0], [functionData], descriptionHash);
    await tx.wait(1);

    if (network.name == "hardhat" || network.name == "localhost") {
        await moveTime(helper.MIN_DELAY);
        await moveBlocks(1);
    }

    console.log("Executing...");
    const executeTx = await governor.execute(
        [box.address], [0], [functionData], descriptionHash
    );
    await executeTx.wait(1);

    console.log(`Box value: ${await box.retrieve()}`);

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })