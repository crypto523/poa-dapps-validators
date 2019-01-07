const constants = {}
constants.organization = 'poanetwork'
constants.repoName = 'poa-chain-spec'
constants.addressesSourceFile = 'contracts.json'
constants.ABIsSources = {
  KeysManager: 'KeysManager.abi.json',
  PoaNetworkConsensus: 'PoaNetworkConsensus.abi.json',
  ValidatorMetadata: 'ValidatorMetadata.abi.json',
  ProofOfPhysicalAddress: 'ProofOfPhysicalAddress.abi.json'
}
constants.userDeniedTransactionPattern = 'User denied transaction'
constants.rootPath = '/poa-dapps-validators'

constants.navigationData = [
  {
    icon: 'all',
    title: 'All',
    url: constants.rootPath
  },
  {
    icon: 'set',
    title: 'Set Metadata',
    url: `${constants.rootPath}/set`
  },
  {
    icon: 'pending',
    title: 'Pending Changes',
    url: `${constants.rootPath}/pending-changes`
  }
]

constants.NETWORKS = {
  '77': {
    NAME: 'Sokol',
    RPC: 'https://sokol.poa.network',
    BRANCH: 'sokol',
    TESTNET: true
  },
  '99': {
    NAME: 'Core',
    RPC: 'https://core.poa.network',
    BRANCH: 'core',
    TESTNET: false
  },
  '100': {
    NAME: 'Dai',
    RPC: 'https://dai.poa.network',
    BRANCH: 'dai',
    TESTNET: false
  }
}

module.exports = {
  constants
}
