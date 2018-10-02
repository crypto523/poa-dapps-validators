import Web3 from 'web3'
import { constants } from './constants'

const POA_CORE = { RPC_URL: 'https://core.poa.network', netIdName: 'CORE', netId: constants.NETID_CORE }
const POA_SOKOL = { RPC_URL: 'https://sokol.poa.network', netIdName: 'SOKOL', netId: constants.NETID_SOKOL }
const POA_DAI = { RPC_URL: 'https://dai.poa.network', netIdName: 'DAI', netId: constants.NETID_DAI }
const POA_DAI_TEST = { RPC_URL: 'https://dai-test.poa.network', netIdName: 'DAI-TEST', netId: constants.NETID_DAI_TEST }

let getWeb3 = () => {
  return new Promise(function(resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function() {
      var results
      var web3 = window.web3

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        var errorMsg = null
        web3 = new window.Web3(web3.currentProvider)
        web3.version.getNetwork((err, netId) => {
          let netIdName
          console.log('netId', netId)
          switch (netId) {
            case constants.NETID_DAI:
              netIdName = 'Dai'
              console.log('This is Dai', netId)
              break
            case constants.NETID_CORE:
              netIdName = 'Core'
              console.log('This is Core', netId)
              break
            case constants.NETID_DAI_TEST:
              netIdName = 'Dai-Test'
              console.log('This is Dai-Test', netId)
              break
            case constants.NETID_SOKOL:
              netIdName = 'Sokol'
              console.log('This is Sokol', netId)
              break
            default:
              netIdName = 'ERROR'
              errorMsg = `You aren't connected to POA Network.
                  Please, switch to POA network and refresh the page.
                  Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`
              console.log('This is an unknown network.', netId)
          }
          document.title = `${netIdName} - POA Validators dApp`
          var defaultAccount = web3.eth.defaultAccount || null
          if (errorMsg !== null) {
            reject({ message: errorMsg })
          }
          results = {
            web3Instance: web3,
            netIdName,
            netId,
            injectedWeb3: true,
            defaultAccount
          }
          resolve(results)
        })

        console.log('Injected web3 detected.')
      } else {
        // Fallback to localhost if no web3 injection.

        let network
        if (window.location.host.indexOf('sokol') !== -1) {
          network = POA_SOKOL
        } else if (window.location.host.indexOf('dai-test') !== -1) {
          network = POA_DAI_TEST
        } else if (window.location.host.indexOf('dai') !== -1) {
          network = POA_DAI
        } else {
          network = POA_CORE
        }

        document.title = `${network.netIdName} - POA validators dApp`
        const provider = new Web3.providers.HttpProvider(network.RPC_URL)
        let web3 = new Web3(provider)

        results = {
          web3Instance: web3,
          netIdName: network.netIdName,
          netId: network.netId,
          injectedWeb3: false,
          defaultAccount: null
        }
        resolve(results)
        console.log('No web3 instance injected, using Local web3.')
        console.error('Metamask not found')
      }
    })
  })
}

const setWeb3 = netId => {
  let network
  switch (netId) {
    case constants.NETID_SOKOL:
      network = POA_SOKOL
      break
    case constants.NETID_DAI_TEST:
      network = POA_DAI_TEST
      break
    case constants.NETID_CORE:
      network = POA_CORE
      break
    case constants.NETID_DAI:
      network = POA_DAI
      break
    default:
      network = POA_CORE
      break
  }
  const provider = new Web3.providers.HttpProvider(network.RPC_URL)
  return new Web3(provider)
}

export default getWeb3

export { setWeb3 }
