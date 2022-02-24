import './App.css';
import React from 'react';
import Web3 from 'web3';
import axios from 'axios';
import Moralis from 'moralis';
import makeBlockie from 'ethereum-blockies-base64';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Divider } from 'primereact/divider';
import Home from './components/Home';
import Pools from './components/Pools';
import Email from './components/Email';
import CoinList from "./components/CoinList";
import TokenInfo from "./components/TokenInfo";
import Login from './Login'
import Settings from './components/Settings';
import MyNav from './landing/navbar/MyNav';
import 'primereact/resources/themes/tailwind-light/theme.css';
import History from './components/History';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Sidebar } from 'primereact/sidebar';
import Transaction from './components/Transaction';
import Transfer from './components/Transfer';
import ethLogo from './assets/logos/eth.png';
import bncLogo from './assets/logos/bnc.png';
import polyLogo from './assets/logos/poly.png';
import avaLogo from './assets/logos/ava.png';
import fanLogo from './assets/logos/fan.png';
import arbitrum_logo from './assets/logos/arbitrum_logo.png';
import { MultiSelect } from 'primereact/multiselect';
import { AutoComplete } from 'primereact/autocomplete';
import Swap from './components/Swap';
import NFT from './components/NFT';
import Price from './components/Price';
import access from './components/access';
import test from './components/test';
import Wallet from './components/Wallet';
import Cefi from './components/CeFi/Cefi';
import { Constants } from './utils/Constants';
import ChtBot from './chatbot/ChtBot'

const web3 = new Web3(window.web3.currentProvider);
const a = new Array(1);
Moralis.start({
  serverUrl: 'https://kz6gugt8lfij.usemoralis.com:2053/server',
  appId: 'MEoK7FwOuiRN4pTMQbSBOrDfvD29XvGqfu8avXDA',
});
Moralis.initPlugins();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userlogin: false,
      visibleRight: false,
      address: [],
      defaultAddress: null,
      selectedAddress: [],
      loading: false,
      chain: [],
      displayBasic: false,
      visibleFullScreen: false,
      position: 'center',
      showBot: false,
      filteredSearch: null,
      searchInput: null
    };

    this.selectedChain = [
      {
        label: 'Ethereum',
        logo: ethLogo,
      },
      {
        label: 'Binance',
        logo: bncLogo,
      },
      {
        label: 'Polygon',
        logo: polyLogo,
      },
      {
        label: 'Avalanche',
        logo: avaLogo,
      },
      {
        label: 'Fantom',
        logo: fanLogo,
      },
      {
        label: 'Arbitrum',
        logo: arbitrum_logo,
      },
    ];
    this.selectedChain.map((item) => {
      this.state.chain.push(item);
    });
    this.selectedAddress = [
      {
        label: window.localStorage.getItem('publicAddress'),
        code: window.localStorage.getItem('publicAddress'),
      },
    ];
    this.selectedAddress.map((item) => {
      this.state.selectedAddress.push(item);
    });
  }

  componentDidMount = async () => {
    if (!this.state.userlogin) {
      const user = window.sessionStorage.getItem('access-token');
      if (user) {
        this.setState({ userlogin: true });
        console.log(`here's the token`);
        const publicAddress = window.localStorage.getItem('publicAddress');
        const address = await axios.get(
          `${Constants.BASE_URL}/getDetails/${publicAddress}`
        );
        address.data.results.address.map((value, index, array) => {
          const data = {
            label:
              array[index].adrName == undefined
                ? `${array[index].walletAddress.slice(0, 30)}...`
                : array[index].adrName,
            code: array[index].walletAddress,
          };
          if (index == 0) {
            this.selectedAddress[0].label = data.label;
          }
          if (index !== 0) {
            this.selectedAddress.push(data);
          }
        });
        this.setState({ address: address.data.results.address });
      }
      console.log(`token: ${user}`);
    }
  };

  componentDidUpdate = async () => {
    const publicAddress = window.localStorage.getItem('publicAddress');
    const address = await axios.get(
      `${Constants.BASE_URL}/getDetails/${publicAddress}`
    );
    this.setState({ address: address.data.results.address });
  };

  // buyCrypto = async () => {

  // };



  handleLogout = () => {
    window.sessionStorage.clear();
    this.props.history.push('/')
    this.setState({ userlogin: false });
  };

  handleClick = async () => {
    const publicAddress = (
      await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
    )[0];
    if (!publicAddress) {
      window.alert('Please activate MetaMask first.');
    }
    try {
      const response = await axios.post(`${Constants.BASE_URL}/metamask`, {
        publicAddress: publicAddress,
        walletAddress: publicAddress,
      });
      const nonce = response.data.nonce;
      const msg = await this.handleSignMessage({ publicAddress, nonce });
      console.log(msg);
      const jwt = await this.handleAuthenticate(msg);
      console.log('token:', jwt);
      if (jwt.success) {
        window.sessionStorage.setItem('access-token', jwt.token);
        window.localStorage.setItem('publicAddress', publicAddress);
        window.location = '/';
      } else {
        console.log('Login Fail');
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleSignMessage = function ({ publicAddress, nonce }) {
    return new Promise(function (resolve, reject) {
      return web3.eth.personal.sign(
        web3.utils.utf8ToHex('I am signing my one-time nonce: ' + nonce),
        publicAddress,
        function (err, signature) {
          if (err) return reject(err);
          return resolve({
            publicAddress: publicAddress,
            signature: signature,
          });
        }
      );
    });
  };

  handleAuthenticate = function ({ publicAddress, signature }) {
    return fetch(`${Constants.BASE_URL}/verifyMetamask`, {
      body: JSON.stringify({
        publicAddress: publicAddress,
        signature: signature,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).then(function (res) {
      return res.json();
    });
  };

  onChainChange(e) {
    let selectedAddress = [...this.state.selectedAddress];

    if (e.checked) selectedAddress.push(e.value);
    else selectedAddress.splice(selectedAddress.indexOf(e.value), 1);

    this.setState({ selectedAddress: selectedAddress, loading: false });
  }

  itemTemplate = (option) => {
    return (
      <div>
        <img src={option.logo} className="h-1rem w-1rem mr-1" />
        <>{option.label}</>
      </div>
    );
  };

  listTemplate = (option) => {
    return (
      <div className="flex inline">
        <img
          src={makeBlockie(option.code)}
          className="w-2rem h-2rem border-circle m-2"
        />
        <h4 className="my-3">{option.label}</h4>
      </div>
    );
  };

  setDetails = async () => {
    const userDetails = {
      selectedAddress: this.state.selectedAddress,
      selectedChain: this.state.chain,
      publicAddress: await window.ethereum.request({
        method: 'eth_requestAccounts',
      })[0],
    };
    window.localStorage.setItem('userDetail', JSON.stringify(userDetails));
    this.setState({ loading: true });
  };

  onClick(name, position) {
    let state = {
      [`${name}`]: true,
    };

    if (position) {
      state = {
        ...state,
        position,
      };
    }

    this.setState(state);
  }

  onHide(name) {
    this.setState({
      [`${name}`]: false,
    });
  }



  handleSearch = async (e) => {
    const data = await axios.get(`https://api.coingecko.com/api/v3/search?query=${e.query}`)
    console.log(data.data.coins);

    console.log(e.query);

    setTimeout((e) => {
      const filteredSearch = [...data.data.coins];
      console.log(filteredSearch);
      this.setState({ filteredSearch: filteredSearch, });
    }, 250);

    console.log(this.state.searchInput);
  }

  handleSelect = (e) => {
    console.log(e.value.id);

    if (this.props.location.pathname.split('/')[1] === `tokeninfo`) {
      this.props.history.push(`/tokeninfo/${e.value.id}`);
      window.location.reload();
    }

    this.props.history.push(`/tokeninfo/${e.value.id}`);
    // this.props.history.push(`/tokeninfo/${e.value.id}`)
    // window.location = `/tokeninfo/${e.value.id}`
  }

  itemTemp(item) {
    return (
      <div className="">
        <img className="inline mt-2" style={{ width: '20px' }} alt={item.name} src={item.large} />
        <div className="inline ml-1">{item.name}</div>
      </div>
    );
  }


  render() {
    let items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => {
          this.props.history.push('/');
        },
        className: 'p-menuitem-active',
      },
      // { label: 'Explore on', icon: 'pi pi-th-large' },
      {
        label: 'Address Box',
        command: () => {
          this.props.history.push('/setting');
        },
        icon: 'pi pi-box',
      },
      {
        label: 'Email',
        icon: 'pi pi-envelope',
        command: () => {
          this.props.history.push('/email');
        },
      },
      {
        label: 'NFTs',
        icon: 'pi pi-palette',
        command: () => {
          this.props.history.push('/NFTs');
        },
      },
      {
        label: 'History',
        icon: 'pi pi-history',
        command: () => {
          this.props.history.push('/history');
        },
      },
      {
        label: 'CeFi',
        icon: 'pi pi-wallet',
        command: () => {
          this.props.history.push('/CeFi');
        },
      },
      {
        label: 'Records',
        command: () => {
          this.props.history.push('/records');
        },
        icon: 'pi pi-database',
      },
      {
        label: 'Send',
        icon: 'pi pi-send',
        command: () => {
          this.props.history.push('/send');
        },
      },
      {
        label: 'Swap',
        icon: 'pi pi-sort-alt',
        command: () => {
          this.props.history.push('/swap');
        },
      },
      {
        label: 'Research',
        icon: 'pi pi-chart-line',
        command: () => {
          this.props.history.push('/coinlist');
        },
      },
      // {
      //   label: 'Pools',
      //   icon: 'pi pi-circle',
      //   command: () => {
      //     this.props.history.push('/pools');
      //   },
      // },
    ];
    return (
      <div>
        <Switch>
          {!this.state.userlogin && (
            <div>
              <MyNav />
              <Route exact path="/" component={Login} />
              <Route exact path="/access" component={access} />
            </div>
          )}
          {this.state.userlogin && (
            <div className="grid h-screen m-0">
              <div className="col-2 p-0 bg-indigo-50">
                <div className="flex flex-column fixed overflow-auto">
                  <div className="my-1 ml-3">
                    <h1>Plutus</h1>
                  </div>
                  <Menu
                    model={items}
                    className="w-12rem h-30rem border-none mx-2 bg-indigo-50"
                  />

                  <Button
                    label="Sign Out"
                    className="p-button-danger m-3"
                    onClick={this.handleLogout}
                  />
                </div>
              </div>
              <Divider layout="vertical" className="m-0 p-0" />
              <div className="lg:col-10 p-0 md:col-12 bg-indigo-100">

                <Toolbar
                  className=" border-none col-11 mt-1 bg-indigo-100"
                  right={
                    <div>
                      <Button
                        className="p-button-outlined"
                        icon="pi pi-credit-card"
                        tooltip="Buy Crypto with Cash"
                        tooltipOptions={{ position: 'bottom' }}
                        onClick={() =>
                          this.setState({ visibleFullScreen: true })
                        }
                        className="mr-4"
                      />
                      <AutoComplete
                        className="mr-2"
                        placeholder="Search Tokens"
                        value={this.state.searchInput}
                        suggestions={this.state.filteredSearch}
                        completeMethod={this.handleSearch}
                        onSelect={this.handleSelect}
                        itemTemplate={this.itemTemp}
                        field="name"
                        onChange={(e) => this.setState({ searchInput: e.value })}
                      />
                      <Sidebar
                        visible={this.state.visibleFullScreen}
                        fullScreen
                        className=""
                        onHide={() =>
                          this.setState({ visibleFullScreen: false })
                        }
                      >
                        <div class="card">
                          <div class="flex flex-column card-container green-container">
                            <div class="flex align-items-center justify-content-center">
                              <iframe
                                height="595px"
                                width="440px"
                                id="onramper-widget"
                                title="Onramper widget"
                                frameborder="no"
                                allow="accelerometer; autoplay; camera; gyroscope; payment;"
                                src="https://widget.onramper.com?color=266678?defaultCrypto=ETH?defaultAmount=101&apiKey=pk_test_ehDEs09CzGKxBnQyrkqVP7OSQfk1ZbAtz_CPpn38YEE0"
                              ></iframe>

                            </div>
                          </div>
                        </div>
                      </Sidebar>

                      <MultiSelect
                        style={{ backgroundColor: '#f7f7fe' }}
                        classname="mr-3"
                        placeholder="Networks"
                        value={this.state.chain}
                        options={this.selectedChain}
                        itemTemplate={this.itemTemplate}
                        onChange={(e) => {
                          this.setState({ chain: e.value });
                        }}
                        onHide={() => {
                          this.setDetails();
                        }}
                        onShow={() => this.setState({ loading: false })}
                      />
                    </div>
                  }
                  start={<div>{!this.state.userlogin && <h2>FundNAV</h2>}</div>}
                />

                <ChtBot />
                <div class="fixed m-3 md:bottom-0 md:right-0 bottom-50 right-50 flex align-items-center justify-content-center">
                </div>

                <Route
                  exact
                  path="/"
                  isAuth={this.state.userlogin}
                  component={Home}
                  children={
                    <Home
                      loading={this.state.loading}
                      selectedAddress={this.state.selectedAddress}
                      selectedChain={this.state.chain}
                    />
                  }
                />
                <Route
                  exact
                  path="/test"
                  isAuth={this.state.userlogin}
                  component={test}
                />
                <Route
                  exact
                  path="/wallet/:walletAddress"
                  isAuth={this.state.userlogin}
                  component={Wallet}
                />
                <Route
                  exact
                  path="/CeFi"
                  isAuth={this.state.userlogin}
                  component={Cefi}
                />
                <Route
                  exact
                  path="/setting"
                  isAuth={this.state.userlogin}
                  component={Settings}
                />
                <Route
                  exact
                  path="/records"
                  isAuth={this.state.userlogin}
                  component={History}
                />
                <Route
                  exact
                  path="/history"
                  isAuth={this.state.userlogin}
                  component={Transaction}
                  children={
                    <Transaction
                      loading={this.state.loading}
                      selectedAddress={this.state.selectedAddress}
                      selectedChain={this.state.chain}
                    />
                  }
                />
                <Route
                  exact
                  path="/send"
                  isAuth={this.state.userlogin}
                  component={Transfer}
                />
                <Route
                  exact
                  path="/swap"
                  isAuth={this.state.userlogin}
                  component={Swap}
                />
                <Route
                  exact
                  path="/pools"
                  isAuth={this.state.userlogin}
                  component={Pools}
                />
                <Route
                  exact
                  path="/coinlist"
                  isAuth={this.state.userlogin}
                  component={CoinList}
                />
                <Route
                  exact
                  path="/email"
                  isAuth={this.state.userlogin}
                  component={Email}
                />
                <Route
                  exact
                  path="/price/:chainId/:contractAddress"
                  isAuth={this.state.userlogin}
                  component={Price}
                />
                <Route
                  exact
                  path="/tokeninfo/:id"
                  isAuth={this.state.userlogin}
                  component={TokenInfo}
                />
                <Route
                  exact
                  path="/NFTs"
                  isAuth={this.state.userlogin}
                  component={NFT}
                  children={
                    <NFT
                      loading={this.state.loading}
                      selectedAddress={this.state.selectedAddress}
                      selectedChain={this.state.chain}
                    />
                  }
                />


              </div>
            </div>
          )}
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
