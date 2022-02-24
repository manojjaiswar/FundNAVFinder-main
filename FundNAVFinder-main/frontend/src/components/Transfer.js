import { Card } from 'primereact/card';
import React, { Component } from 'react';
import Moralis from 'moralis';
import Web3 from 'web3';
import axios from 'axios';
import _, { add } from 'lodash';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { TabPanel, TabView } from 'primereact/tabview';

Moralis.start({
  serverUrl: 'https://kz6gugt8lfij.usemoralis.com:2053/server',
  appId: 'MEoK7FwOuiRN4pTMQbSBOrDfvD29XvGqfu8avXDA',
});

const web3 = new Web3(window.web3.currentProvider);

export default class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chain: null,
      address: null,
      amount1: null,
      value1: null,
      tokenlist: [],
      tokenAddress: null,
      authentication: false,
      disable: false,
      errMsg: '',
      showError: false
    };
  }
  componentDidMount = async () => {
    Moralis.enableWeb3()
    // Moralis.authenticate().then(async (user) => {
    //   if (user) {
    //     this.setState({ authentication: true });
    //   }
    // });
  };

  send = async (event) => {
    if (
      this.state.chain !== null &&
      (this.state.tokenAddress !== null && this.state.tokenAddress !== undefined) &&
      (this.state.value1 !== null && this.state.value1 !== '') &&
      (this.state.amount1 !== null && this.state.amount1 !== '')
    ) {

      if (this.state.amount1 <= this.state.tokenAddress.balance) {
        this.setState({ disable: false });
        event.preventDefault();
        console.log(this.state.tokenAddress)
        if (this.state.tokenAddress == 'ETH') {
          const options = {
            type: 'native',
            tokenId: 1,
            amount: Moralis.Units.ETH(this.state.amount1),
            receiver: this.state.value1,
          };
          await Moralis.transfer(options);
        } else {
          const options = {
            type: 'erc20',
            tokenId: 1,
            amount: Moralis.Units.Token(
              this.state.amount1,
              this.state.tokenAddress.decimal
            ),
            receiver: this.state.value1,
            contractAddress: this.state.tokenAddress.code,
          };
          await Moralis.transfer(options);

        }
      } else {
        this.setState({ disable: true, showError: true });
      }
    }


    // if (this.state.chain == null) {
    //   this.setState({ errMsg: 'Please Select a Chain' });
    // }
    // if (this.state.value1 == null) {
    //   this.setState({ errMsg: 'Please enter the Address' });
    // }
    // if (this.state.tokenAddress == null) {
    //   this.setState({ errMsg: 'Please enter the Address' });
    // }
    // if (this.state.amount1 == null) {
    //   this.setState({ errMsg: 'Please enter a Amount' });
    // }


  };

  itemTemplate = (option) => {
    return (
      <div className="flex justify-content-between">
        <div className="flex">
          <img src={option.img} className="h-1rem w-1rem mr-1" />
          <div>{option.label}</div>
        </div>
        <div className="text-right">{option.balance}</div>
      </div>
    );
  };

  handleChain = async (e) => {
    this.setState({ disable: false });

    const defaultAddress = window.localStorage.getItem('publicAddress');


    console.log(e.target.value);
    if (e.target.value.code == 'eth') {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // chainId must be in hexadecimal numbers
      });
      this.setState({
        chain: e.target.value,
        amount1: '',
        amount2: '',
      });
      const a = [];

      const list = await axios.get(
        'https://api.1inch.exchange/v3.0/1/tokens' //56bin //137pol
      );
      const listOfTokens = _.values(list.data.tokens);
      console.log(listOfTokens);
      listOfTokens.map((value, index, array) => {
        const data = {
          label: array[index].symbol,
          code: array[index].address,
          img: array[index].logoURI,
          decimal: array[index].decimals,
        };
        a.push(data);
      });
      console.log(a);



      const userTokens = await axios.get(`https://api.covalenthq.com/v1/1/address/${defaultAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_f4e3ad4d6ace494d80f2020cc49`)
      const userData = userTokens.data.data.items

      const finalData = []
      for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < userData.length; j++) {
          if (a[i].code == userData[j].contract_address && userData[j].balance !== "0") {
            const tokenData = {
              label: a[i].label,
              code: a[i].code,
              img: a[i].img,
              decimal: a[i].decimal,
              balance: userData[j].balance / 10 ** userData[j].contract_decimals
            };
            finalData.push(tokenData)
          }
        }

      }
      console.log(finalData);


      this.setState({ tokenlist: finalData });
    }
    if (e.target.value.code == 'matic') {
      this.setState({ chain: e.target.value, amount1: '', amount2: '' });
      if (window.ethereum) {
        try {
          // check if the chain to connect to is installed
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }], // chainId must be in hexadecimal numbers
          });
        } catch (error) {
          // This error code indicates that the chain has not been added to MetaMask
          // if it is not, then install it into the user MetaMask
          if (error.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x89',
                    rpcUrls: ['https://polygon-rpc.com/'],
                    chainName: 'Matic Mainnet',
                  },
                ],
              });
            } catch (addError) {
              console.error(addError);
            }
          }
          console.error(error);
        }
      } else {
        // if no window.ethereum then MetaMask is not installed
        alert(
          'MetaMask is not installed. Please consider installing it: https://metamask.io/download.html'
        );
      }

      const a = [];

      const list = await axios.get(
        'https://api.1inch.exchange/v3.0/137/tokens' //56bin //137pol
      );
      const listOfTokens = _.values(list.data.tokens);
      console.log(listOfTokens);
      listOfTokens.map((value, index, array) => {
        const data = {
          label: array[index].symbol,
          code: array[index].address,
          img: array[index].logoURI,
          decimal: array[index].decimals,
        };
        a.push(data);
      });

      a.map((item, index, array) => {
        if (array[index].code == '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
          array[index].code = '0x0000000000000000000000000000000000001010'
        }
      })

      const userTokens = await axios.get(`https://api.covalenthq.com/v1/137/address/${defaultAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_f4e3ad4d6ace494d80f2020cc49`)
      const userData = userTokens.data.data.items

      const finalData = []
      for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < userData.length; j++) {
          if (a[i].code == userData[j].contract_address && userData[j].balance !== "0") {
            const tokenData = {
              label: a[i].label,
              code: a[i].code,
              img: a[i].img,
              decimal: a[i].decimal,
              balance: userData[j].balance / 10 ** userData[j].contract_decimals
            };
            finalData.push(tokenData)
          }
        }

      }
      console.log(finalData);


      this.setState({ tokenlist: finalData });
    }
    if (e.target.value.code == 'bsc') {
      this.setState({ chain: e.target.value, amount1: '', amount2: '' });

      if (window.ethereum) {
        try {
          // check if the chain to connect to is installed
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }], // chainId must be in hexadecimal numbers
          });
        } catch (error) {
          console.log(error);
          // This error code indicates that the chain has not been added to MetaMask
          // if it is not, then install it into the user MetaMask
          if (error.code == '4902') {
            console.log('hello');
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x38',
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    chainName: 'Binance Smart Chain BSC',
                  },
                ],
              });
            } catch (addError) {
              console.error(addError);
            }
          }
          console.error(error);
        }
      } else {
        // if no window.ethereum then MetaMask is not installed
        alert(
          'MetaMask is not installed. Please consider installing it: https://metamask.io/download.html'
        );
      }

      const a = [];

      const list = await axios.get(
        'https://api.1inch.exchange/v3.0/56/tokens' //56bin //137pol
      );
      const listOfTokens = _.values(list.data.tokens);
      console.log(listOfTokens);
      listOfTokens.map((value, index, array) => {
        const data = {
          label: array[index].symbol,
          code: array[index].address,
          img: array[index].logoURI,
          decimal: array[index].decimals,
        };
        a.push(data);
      });
      console.log(a);

      const userTokens = await axios.get(`https://api.covalenthq.com/v1/137/address/${defaultAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_f4e3ad4d6ace494d80f2020cc49`)
      const userData = userTokens.data.data.items

      const finalData = []
      for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < userData.length; j++) {
          if (a[i].code == userData[j].contract_address && userData[j].balance !== "0") {
            const tokenData = {
              label: a[i].label,
              code: a[i].code,
              img: a[i].img,
              decimal: a[i].decimal,
              balance: userData[j].balance / 10 ** userData[j].contract_decimals
            };
            finalData.push(tokenData)
          }
        }

      }
      console.log(finalData);


      this.setState({ tokenlist: finalData });

    }
  };

  handleMax = () => {
    this.setState({ amount1: this.state.tokenAddress.balance, disable: false, showError: false })
    console.log(this.state.tokenAddress);
  }

  render() {
    const defaultAddress = window.localStorage.getItem('publicAddress');

    const chain = [
      { label: 'Ethereum', code: 'eth' },
      { label: 'Polygon', code: 'matic' },
      { label: 'Binance', code: 'bsc' },
    ];
    return (
      <div className="lg:col-6 lg:col-offset-3 md-8 md:col-offset-2 sm-12 sm:col-offset-0">
        <div className="text-3xl text-bold mb-2 text-700">Send</div>
        <Card>
          <small id="username-help" className="p-error">
            {this.state.errMsg}
          </small>
          <Dropdown
            className="inputfield w-full my-2"
            options={chain}
            value={this.state.chain}
            placeholder="Network"
            onChange={(e) => this.handleChain(e)}
          />
          <br />
          <span className="p-float-label my-3">
            <InputText
              className="inputfield w-full"
              id="inputtext"
              value={this.state.value1}
              onChange={(e) =>
                this.setState({ value1: e.target.value, disable: false })
              }
            />
            <label htmlFor="inputtext">Recipient Address</label>
          </span>
          <Dropdown
            className="inputfield w-full my-2"
            value={this.state.tokenAddress}
            options={this.state.tokenlist}
            onChange={(e) =>
              this.setState({ tokenAddress: e.value, disable: false })
            }
            placeholder="Select a Token"
            itemTemplate={this.itemTemplate}
            filter
            showClear
            filterBy="label"
          />
          <div className="flex justify-content-evenly my-2">
            <div className="p-inputgroup">
              <InputText
                className="w-full"
                value={this.state.amount1}
                placeholder="0.0"
                onChange={(e) =>
                  this.setState({ amount1: e.target.value, disable: false, showError: false })
                }
              />
              <Button label="Max" onClick={this.handleMax} />
              {/* <InputText className="w-full ml-1"  /> */}
            </div>
          </div>
          {this.state.showError && (
            <small id="username-help" className="p-error ml-3">
              Insufficient Balance
            </small>
          )}
          <Button
            disabled={this.state.disable}
            label="Send"
            onClick={this.send}
            className="my-2 w-full"
          />

          {/* <TabPanel header="NFTs">
              Coming Soon */}
          {/* <InputText
                className="inputfield w-full my-2"
                value="Ethereum"
                disabled
              />
              <br />
              <span className="p-float-label">
                <InputText
                  className="inputfield w-full my-2"
                  id="inputtext"
                  value={this.state.value1}
                  onChange={(e) => this.setState({ value1: e.target.value })}
                />
                <label htmlFor="inputtext">Recipient Address</label>
              </span>
              <div className="flex justify-content-evenly my-2">
                <InputText className="w-full" />
              </div>
              <Button label="Send" className="my-2 w-full" /> */}
          {/* </TabPanel>
          </TabView> */}
        </Card>
      </div>
    );
  }
}
