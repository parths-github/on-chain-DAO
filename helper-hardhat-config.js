const QUORUM_PERCENTAGE = 4 // Need 4% of voters to pass
const VOTING_PERIOD = 5 // blocks
const VOTING_DELAY = 1 // 1 Block - How many blocks till a proposal vote becomes active

const helper = {
    QUORUM_PERCENTAGE: 4, // Need 4% of voters to pass
    VOTING_PERIOD: 5, // blocks
    VOTING_DELAY: 1,  // 1 Block - How many blocks till a proposal vote becomes active
    MIN_DELAY: 3600,
    PROPSERS: [],
    EXECUTORS: [],
    ADDRESS_ZERO: "0x0000000000000000000000000000000000000000",
    BOX: {
        functionToCall: "store",
        args: 100
    },
    PROPOSAL_FILE: "proposals.json"
}

module.exports = {
    helper
}