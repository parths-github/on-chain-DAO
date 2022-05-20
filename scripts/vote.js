const {helper} = require("../helper-hardhat-config");
const fs = require("fs");
const { network, ethers } = require("hardhat");
const { moveBlocks } = require("../helpers");
//  function castVoteWithReason(
//     uint256 proposalId,
//     uint8 support,
//     string calldata reason
// ) public virtual override returns (uint256)


async function vote(proposalId, vote, reason) {
    const governor = await ethers.getContract("GovernorContract");
    const blockNumber = await network.provider.send("eth_blockNumber");
    console.log(parseInt(blockNumber, 16));
    // Will get some value as we mint the governance token to msg.sender
    const numVotes = await governor.getVotes("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", parseInt(blockNumber, 16) - 1);
    console.log(parseInt(numVotes, 16));
    const tx = await governor.castVoteWithReason(proposalId, vote, reason);
    const receipt = await tx.wait(1);
    console.log(receipt.events[0].args.reason);

    // Getting the proposal state
    let proposalState = await governor.state(proposalId);
    console.log(`Proposal state is : ${proposalState}`);

    // jumping to the voting period in case of local Network
    if (network.name == "hardhat" || network.name == "localhost") {
        await moveBlocks(helper.VOTING_PERIOD + 1);
    }

    proposalState = await governor.state(proposalId);
    console.log(`Proposal state is : ${proposalState}`);


}

const main = async() => {
    console.log(`Voting...`)
    // Get the proposal Id from proposals.json file
    const proposals = JSON.parse(fs.readFileSync(helper.PROPOSAL_FILE, "utf8"));
    const proposalId = proposals[network.config.chainId][0];


    

    // 0 = Against, 1 = For, 2 = Abstain for this example
    const voteWay = 1
    const reason = "I loke the number 100";
    await vote(proposalId, voteWay, reason);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })