// function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description
// We need to provide above arguments

const fs = require("fs");
const { ethers, network } = require("hardhat");
const { helper } = require("../helper-hardhat-config");
const { moveBlocks } = require("../helpers");


const main = async() => {
    const governor = await ethers.getContract("GovernorContract");
    const box = await ethers.getContract("Box");
    // Interface has function which encodes the function data
    const encodeFunctionCall = box.interface.encodeFunctionData(helper.BOX.functionToCall, [helper.BOX.args]);
    console.log(encodeFunctionCall);

    const proposalDescription = "Proposal #1 Change the value";
    const tx = await governor.propose(
        [box.address], // Array of target address to call, here only one as we want to call only one fucntion
        [0], // Value of ethers to be passed
        [encodeFunctionCall],
        proposalDescription, {
            gasLimit: 210000
        }
    )
    const receipt = await tx.wait(1);
    //console.log(receipt.events[0].args.proposalId);
    const proposalId = receipt.events[0].args.proposalId.toString();
    console.log(`Proposal Id: ${proposalId.toString()}`);

    // But after creating proposal there's voting delay of some blocks until voting starts
    // But in case of local chain there's no one mining the block
    // So we have to manually mine the block
    // But we only want to do this in our developer environment(i.e. in caseof local chain)
    if (network.name == "hardhat" || network.name == "localhost") {
        await moveBlocks(helper.VOTING_DELAY + 1);
    }

    fs.writeFileSync(helper.PROPOSAL_FILE, JSON.stringify({
        [network.config.chainId.toString()]: [proposalId.toString()],
    }))
    


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })