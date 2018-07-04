import "react-select/dist/react-select.css";
import AllValidators from './AllValidators'
import App from './App';
import Footer from './Footer';
import KeysManager from './contracts/KeysManager.contract'
import Loading from './Loading'
import Metadata from './contracts/Metadata.contract'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select'
import createBrowserHistory from 'history/createBrowserHistory'
import getWeb3, { setWeb3 } from './getWeb3'
import helpers from './helpers'
import networkAddresses from './contracts/addresses';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route, NavLink } from 'react-router-dom'
import logoBase from './images/logos/logo_validators_dapp@2x.png'
import logoSokol from './images/logos/logo_sokol@2x.png'

const errorMsgNoMetamaskAccount = `Your MetaMask is locked.
Please choose your voting key in MetaMask and reload the page.
Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`;

const history = createBrowserHistory()
const baseRootPath = '/poa-dapps-validators';
const sectionsTitles = ['All', 'Set Metadata', 'Pending Changes'];

let Header = ({ netId, onChange, injectedWeb3 }) => {

  const headerClassName = netId === '77' ? 'sokol' : '';
  const logoImageName = netId === '77' ? logoSokol : logoBase;

  let select;

  if (!injectedWeb3) {
    select = <Select id="netId"
      value={netId}
      onChange={onChange}
      style={{
        width: '150px',
      }}
      wrapperStyle={{
        width: '150px',
      }}
      clearable={false}
      options={[
        { value: '77', label: 'Network: Sokol' },
        { value: '99', label: 'Network: Core' },
      ]} />
  }
  return (
    <header id="header" className={`header ${headerClassName}`}>
      <div className="container">
        <a
          className="header-logo-a"
          href={baseRootPath}
        >
          <img
            className="header-logo"
            src={logoImageName} alt=""
          />
        </a>
        <div className="links-container">
          <NavLink
            activeClassName="active"
            className="link"
            exact
            to={`${baseRootPath}/`}
          >
            <i className="link-icon link-icon-all" /><span className='link-text'>{sectionsTitles[0]}</span>
          </NavLink>
          <NavLink
            activeClassName="active"
            className="link"
            to={`${baseRootPath}/set`}
          >
            <i className="link-icon link-icon-set-metadata" /><span className='link-text'>{sectionsTitles[1]}</span>
          </NavLink>
          <NavLink
            activeClassName="active"
            className="link"
            to={`${baseRootPath}/pending-changes`}
          >
            <i className="link-icon link-icon-pending-changes" /><span className='link-text'>{sectionsTitles[2]}</span>
          </NavLink>
        </div>
        {select}
      </div>
    </header>
  )
}

class AppMainRouter extends Component {
  constructor(props) {

    super(props);

    this.rootPath = baseRootPath;
    history.listen(this.onRouteChange.bind(this));
    this.onSetRender = this.onSetRender.bind(this);
    this.onPendingChangesRender = this.onPendingChangesRender.bind(this);
    this.onAllValidatorsRender = this.onAllValidatorsRender.bind(this)
    this.onConfirmPendingChange = this.onConfirmPendingChange.bind(this);
    this.onFinalize = this.onFinalize.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onNetworkChange = this.onNetworkChange.bind(this);
    this.state = {
      showSearch: true,
      keysManager: null,
      metadataContract: null,
      poaConsensus: null,
      votingKey: null,
      loading: true,
      searchTerm: '',
      injectedWeb3: true,
      netId: '',
      error: false,
      title: sectionsTitles[0]
    }
    getWeb3().then(async (web3Config) => {
      return networkAddresses(web3Config)
    }).then(async (config) => {
      const { web3Config, addresses } = config;
      const keysManager = new KeysManager()
      await keysManager.init({
        web3: web3Config.web3Instance,
        netId: web3Config.netId,
        addresses,
      })
      const metadataContract = new Metadata()
      await metadataContract.init({
        web3: web3Config.web3Instance,
        netId: web3Config.netId,
        addresses,
      })
      this.setState({
        votingKey: web3Config.defaultAccount,
        keysManager,
        metadataContract,
        loading: false,
        injectedWeb3: web3Config.injectedWeb3,
        netId: web3Config.netId,
      })
    }).catch((error) => {
      console.error(error.message);
      this.setState({ loading: false, error: true });
      helpers.generateAlert("error", "Error!", error.message);
    })
  }
  onRouteChange() {

    const setMetadata = this.rootPath + "/set";
    this.setTitle()

    if (history.location.pathname === setMetadata) {
      this.setState({ showSearch: false })
      if (this.state.injectedWeb3 === false) {
        helpers.generateAlert("warning", "Warning!", 'Metamask was not found');
      }
    } else {
      this.setState({ showSearch: true })
    }

  }
  setTitle() {
    if (history.location.pathname.includes('/set')) {
      this.state.title = sectionsTitles[1];
    }
    else if (history.location.pathname.includes('/pending-changes')) {
      this.state.title = sectionsTitles[2];
    }
    else {
      this.state.title = sectionsTitles[0];
    }
  }
  checkForVotingKey(cb) {
    if (this.state.votingKey && !this.state.loading) {
      return cb();
    } else {
      helpers.generateAlert("warning", "Warning!", errorMsgNoMetamaskAccount);
      return ''
    }
  }
  onSetRender() {
    if (!this.state.netId) {
      return '';
    }
    return this.checkForVotingKey(() => {
      return <App web3Config={this.state} />
    });
  }
  async _onBtnClick({ event, methodToCall, successMsg }) {
    event.preventDefault();
    this.checkForVotingKey(async () => {
      this.setState({ loading: true })
      const miningKey = event.currentTarget.getAttribute('miningkey');
      try {
        let result = await this.state.metadataContract[methodToCall]({
          miningKeyToConfirm: miningKey,
          senderVotingKey: this.state.votingKey
        });
        console.log(result);
        this.setState({ loading: false })
        helpers.generateAlert("success", "Congratulations!", successMsg);
      } catch (error) {
        this.setState({ loading: false })
        console.error(error.message);
        helpers.generateAlert("error", "Error!", error.message);
      }
    })
  }
  async onConfirmPendingChange(event) {
    await this._onBtnClick({
      event,
      methodToCall: 'confirmPendingChange',
      successMsg: 'You have successfully confirmed the change!'
    });
  }
  async onFinalize(event) {
    await this._onBtnClick({
      event,
      methodToCall: 'finalize',
      successMsg: 'You have successfully finalized the change!'
    });
  }
  onPendingChangesRender() {
    return this.state.loading || this.state.error ? '' : <AllValidators
      ref="AllValidatorsRef"
      methodToCall="getAllPendingChanges"
      searchTerm={this.state.searchTerm}
      web3Config={this.state}>
      <button onClick={this.onFinalize} className="create-keys-button finalize">Finalize</button>
      <button onClick={this.onConfirmPendingChange} className="create-keys-button">Confirm</button>
    </AllValidators>;
  }
  onAllValidatorsRender() {
    return this.state.loading || this.state.error ? '' : <AllValidators
      searchTerm={this.state.searchTerm}
      methodToCall="getAllValidatorsData"
      web3Config={this.state}
    />
  }
  onSearch(term) {
    this.setState({ searchTerm: term.target.value.toLowerCase() })
  }
  async onNetworkChange(e) {
    const netId = e.value;
    const web3 = setWeb3(netId);
    networkAddresses({ netId }).then(async (config) => {
      const { addresses } = config;
      const keysManager = new KeysManager();
      await keysManager.init({
        web3,
        netId,
        addresses
      });
      const metadataContract = new Metadata()
      await metadataContract.init({
        web3,
        netId,
        addresses
      });
      this.setState({ netId: e.value, keysManager, metadataContract })
    })
  }
  render() {

    console.log('v2.09')

    const search = this.state.showSearch ? <input type="search" className="search-input" onChange={ this.onSearch } placeholder="Address..." /> : '';

    const loading = this.state.loading ? <Loading netId={this.state.netId} /> : ''

    return (
      <Router history={history}>
        <section className="content">
          <Header netId={this.state.netId} onChange={this.onNetworkChange} injectedWeb3={this.state.injectedWeb3} />
          {loading}
          <div className="app-container">
            <div className="container">
              <div className="main-title-container">
                <span className="main-title">{this.state.title}</span>
                { search }
              </div>
            </div>
            <Route exact path="/" render={this.onAllValidatorsRender} web3Config={this.state} />
            <Route exact path={`${this.rootPath}/`} render={this.onAllValidatorsRender} web3Config={this.state} />
            <Route path={`${this.rootPath}/pending-changes`} render={this.onPendingChangesRender} />
            <Route path={`${this.rootPath}/set`} render={this.onSetRender} />
          </div>
          <Footer netId={this.state.netId} />
        </section>
      </Router>
    )
  }
}

ReactDOM.render(<AppMainRouter />, document.getElementById('root'));
registerServiceWorker();
