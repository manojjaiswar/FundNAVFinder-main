import React, { Component } from 'react';
import Moralis from 'moralis';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import _, { add } from 'lodash';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Web3 from 'web3';
import { Card } from 'primereact/card';

Moralis.start({
  serverUrl: 'https://kz6gugt8lfij.usemoralis.com:2053/server',
  appId: 'MEoK7FwOuiRN4pTMQbSBOrDfvD29XvGqfu8avXDA',
});
Moralis.initPlugins();
Moralis.enableWeb3();
const web3 = new Web3(window.web3.currentProvider);

class Swap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenlist: [],
      tokenAddress: null,
      totokenAddress: null,
      chain: '',
      amount1: '',
      amount2: '',
      manager: '',
      gasEstimate: '',
      authentication: false,
      protocol: [],
      disableSwap: false,
      userTokens: [],
      defaultAddress: window.localStorage.getItem('publicAddress'),
    };
  }

  componentDidMount = async () => {
    // Moralis.authenticate().then(async (user) => {
    //   if (user) {
    //     this.setState({ authentication: true });
    //   }
    // });



  };

  // swapping = async (event) => {
  //   event.preventDefault();
  //   let manager = await window.ethereum.request({
  //     method: 'eth_requestAccounts',
  //   });
  //   console.log(manager);
  //   // this.setState({manager : manager})
  //   let info = await web3.eth.getBalance(manager[0]);
  //   console.log(info);
  //   console.log(this.state.tokenAddress.code);
  //   axios.get(
  //     `https://api.1inch.exchange/v3.0/1/swap?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toTokenAddress=${this.state.totokenAddress.code}&amount=10000000000000000&fromAddress=0x3793f758a36c04b51a520a59520e4d845f94f9f2&slippage=1`
  //   );
  //   // axios.get(`https://api.1inch.exchange/v3.0/1/swap?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toTokenAddress=0x6b175474e89094c44da98b954eedeac495271d0f&amount=100000000000000000000&fromAddress=0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5&slippage=1`)
  // };


  handleChain = async (e) => {

    this.setState({ disable: false });
    const defaultAddress = this.state.defaultAddress

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

      const userTokens = await axios.get(`https://api.covalenthq.com/v1/1/address/${defaultAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_f4e3ad4d6ace494d80f2020cc49`)
      const userData = userTokens.data.data.items


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

      this.setState({ userTokens: finalData, tokenlist: a, });
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

      console.log(a);

      const userTokens = await axios.get(`https://api.covalenthq.com/v1/137/address/${defaultAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_f4e3ad4d6ace494d80f2020cc49`)
      const userData = userTokens.data.data.items
      console.log(userData);

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

      // 0x0000000000000000000000000000000000001010



      this.setState({ userTokens: finalData, tokenlist: a, });
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

      const userTokens = await axios.get(`https://api.covalenthq.com/v1/56/address/${defaultAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_f4e3ad4d6ace494d80f2020cc49`)
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

      this.setState({ userTokens: finalData, tokenlist: a, });
    }

  };

  getQuote = async () => {

    if (
      this.state.tokenAddress !== null &&
      this.state.totokenAddress !== null &&
      this.state.amount1 !== ''
    ) {
      if (this.state.chain.code == 'eth') {
        console.log('hii');
        console.log(this.state.amount1);


        try {
          const amount = Number(
            this.state.amount1 * 10 ** this.state.tokenAddress.decimal
          );
          console.log(amount);
          console.log('helo');

          const quote = await axios.get(`https://api.1inch.io/v4.0/1/quote?fromTokenAddress=${this.state.tokenAddress.code}&toTokenAddress=${this.state.totokenAddress.code}&amount=${amount}`)

          console.log(quote);
          const gas = Number(quote.data.estimatedGas) / 10 ** 18;
          console.log(gas);
          this.setState({
            gasEstimate: gas,
          });

          console.log(this.state.totokenAddress.decimal);
          console.log(quote.data.toTokenAmount);
          const calculateAmt =
            quote.data.toTokenAmount / 10 ** this.state.totokenAddress.decimal;
          console.log(calculateAmt);

          this.setState({ amount2: calculateAmt, disableSwap: false })
          // if (Number.isNaN(calculateAmt)) {
          //   this.setState({ amount2: 'INSUFFICIENT LIQUIDITY' });
          // } else {
          //   this.setState({
          //     amount2: calculateAmt,
          //   });
          // }

          // console.log(quote);

          console.log(quote.data.protocols);
          let protocol = [];
          if (quote.data.protocols !== undefined) {
            quote.data.protocols[0].map((item, index, array) => {
              protocol.push(array[index][0].name);
            });
            const protocols = protocol.join(', ');
            console.log(protocols);
            this.setState({ protocol: protocols });
          } else {
            this.setState({ protocol: null });
          }

        } catch {
          console.log('error');
          this.setState({ amount2: 'INSUFFICIENT LIQUIDITY' });
          this.setState({
            disableSwap: true,
          });
        }
        // console.log(quote.statusCodeCode);
        // console.log(quote.toTokenAmount);
        // if (quote.statusCode == 400) {

        // } else {
        //   this.setState({ disableSwap: false });
        // }


      }
      if (this.state.chain.code == 'matic') {
        try {
          console.log(this.state.tokenAddress.decimal);
          const amount = (
            this.state.amount1 * 10 ** this.state.tokenAddress.decimal
          ).toString();
          console.log(amount);

          const quote = await axios.get(`https://api.1inch.io/v4.0/137/quote?fromTokenAddress=${this.state.tokenAddress.code}&toTokenAddress=${this.state.totokenAddress.code}&amount=${amount}`)


          console.log(quote);
          console.log(quote.data.toTokenAmount);
          const gas = Number(quote.data.estimatedGas) / 10 ** 18;
          this.setState({
            gasEstimate: gas,
          });

          const calculateAmt =
            quote.data.toTokenAmount / 10 ** this.state.totokenAddress.decimal;

          this.setState({ amount2: calculateAmt, disableSwap: false })
          let protocol = [];
          if (quote.data.protocols !== undefined) {
            quote.data.protocols[0].map((item, index, array) => {
              protocol.push(array[index][0].name);
            });
            const protocols = protocol.join(', ');
            console.log(protocols);
            this.setState({ protocol: protocols });
          } else {
            this.setState({ protocol: null });
          }
        } catch {
          this.setState({ amount2: 'INSUFFICIENT LIQUIDITY' });
          this.setState({
            disableSwap: true,
          });

        }

        // if (Number.isNaN(calculateAmt)) {

        // } else {
        //   this.setState({
        //     amount2: calculateAmt,
        //   });
        // }


      }
      if (this.state.chain.code == 'bsc') {
        try {
          const amount = Number(
            this.state.amount1 * 10 ** this.state.tokenAddress.decimal
          );
          console.log(amount);

          const quote = await axios.get(`https://api.1inch.io/v4.0/56/quote?fromTokenAddress=${this.state.tokenAddress.code}&toTokenAddress=${this.state.totokenAddress.code}&amount=${amount}`)

          console.log(quote);
          console.log(quote.data.toTokenAmount);
          const gas = Number(quote.data.estimatedGas) / 10 ** 18;
          this.setState({
            gasEstimate: gas,
          });
          const calculateAmt =
            quote.data.toTokenAmount / 10 ** this.state.totokenAddress.decimal;

          this.setState({ amount2: calculateAmt, disableSwap: false })
          let protocol = [];
          if (quote.data.protocols !== undefined) {
            quote.data.protocols[0].map((item, index, array) => {
              protocol.push(array[index][0].name);
            });
            const protocols = protocol.join(', ');
            console.log(protocols);
            this.setState({ protocol: protocols });
          } else {
            this.setState({ protocol: null });
          }
        } catch {

          this.setState({ amount2: 'INSUFFICIENT LIQUIDITY' });
          this.setState({
            disableSwap: true,
          });
        }

      }
    }
  };


  handleSwap = async (e) => {
    if (
      this.state.chain !== null &&
      (this.state.tokenAddress !== null && this.state.tokenAddress !== undefined) &&
      (this.state.totokenAddress !== null && this.state.totokenAddress !== undefined) &&
      (this.state.amount1 !== null && this.state.amount1 !== '') &&
      (this.state.amount2 !== null && this.state.amount2 !== '')

    ) {

      if (this.state.amount1 <= this.state.tokenAddress.balance) {
        this.setState({ disableSwap: false })
        let manager = this.state.defaultAddress;
        console.log(manager);

        let amount = Number(
          this.state.amount1 * 10 ** this.state.tokenAddress.decimal
        );

        const chain = () => {
          if (this.state.chain.code == 'eth') {
            return '1';
          } else if (this.state.chain.code == 'matic') {
            return '137';
          } else {
            return '56';
          }
        };

        const chain2 = () => {
          if (this.state.chain.code == 'eth') {
            return 'eth';
          } else if (this.state.chain.code == 'matic') {
            return 'polygon';
          } else {
            return 'bsc';
          }
        }
        console.log(chain());

        const allowance = await axios.get(`https://api.1inch.io/v4.0/${chain()}/approve/allowance?tokenAddress=${this.state.tokenAddress.code}&walletAddress=${manager}`)
        console.log(allowance);
        console.log(allowance.data.allowance);

        if (allowance.data.allowance !== 0) {
          await Moralis.Plugins.oneInch.approve({
            chain: chain2(),
            tokenAddress: this.state.tokenAddress.code,
            fromAddress: manager,
          });
        }



        // this.doSwap();
      }

      else {
        this.setState({ amount2: "INSUFFICIENT FUNDS", disableSwap: true })
      }
      // const allowance = await Moralis.Plugins.oneInch.hasAllowance({
      //   chain: chain(),
      //   fromTokenAddress: this.state.tokenAddress.code,
      //   fromAddress: manager[0],
      //   amount: amount,
      // });



      // const receipt = await Moralis.Plugins.oneInch.swap({
      //   chain: chain(),
      //   fromTokenAddress: this.state.tokenAddress.code,
      //   toTokenAddress: this.state.totokenAddress.code,
      //   amount: amount,
      //   fromAddress: manager[0],
      //   slippage: 1,
      // });

    } else {
      this.setState({ disableSwap: true })
    }


  };

  // doSwap = async () => {
  // let manager = await window.ethereum.request({
  //   method: 'eth_requestAccounts',
  // });
  // console.log(manager);

  // let amount = Number(
  //   this.state.amount1 * 10 ** this.state.tokenAddress.decimal
  // );
  // const receipt = await Moralis.Plugins.oneInch.swap({
  //   chain: 'eth',
  //   fromTokenAddress: this.state.tokenAddress.code,
  //   toTokenAddress: this.state.totokenAddress.code,
  //   amount: amount,
  //   fromAddress: manager[0],
  //   slippage: 1,
  // });

  // console.log(receipt);
  // console.log(receipt.slippage);
  // };

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

  handleMax = () => {
    this.setState({ amount1: this.state.tokenAddress.balance })
  }

  render() {

    const chain = [
      { label: 'Ethereum', code: 'eth' },
      { label: 'Polygon', code: 'matic' },
      { label: 'Binance', code: 'bsc' },
    ];
    return (
      <div className="lg:col-6 lg:col-offset-3 md-8 md:col-offset-2 sm-12 sm:col-offset-0">
        <div className="text-3xl text-bold mb-2 text-700">Swap</div>
        <Card>
          <Dropdown
            className="inputfield w-full my-2"
            options={chain}
            value={this.state.chain}
            placeholder="Network"
            onChange={(e) => {
              this.setState({ amount1: null, amount2: null });
              this.handleChain(e);

            }}
          />
          <Dropdown
            className="w-full my-2"
            value={this.state.tokenAddress}
            options={this.state.userTokens}
            emptyMessage='Insufficient Funds'
            onChange={(e) => {
              this.setState({ tokenAddress: e.value, disableSwap: false });
            }}
            onBlur={() => this.getQuote()}
            itemTemplate={this.itemTemplate}
            placeholder="Select a Token"
            filter
            filterBy="label"
          />
          <br />
          <span className="p-float-label my-3">
            <div className="p-inputgroup">
              <InputText
                placeholder="0.0"
                className="w-full"
                value={this.state.amount1}
                onChange={(e) => {
                  this.setState({ amount1: e.target.value, disableSwap: false });
                  setTimeout(() => {
                    this.getQuote();
                  }, 200);
                }}
              />
              <Button label="Max" onClick={() => {
                this.handleMax();
                setTimeout(() => {
                  this.getQuote();
                }, 200);
              }} />
            </div>
          </span>
          <Dropdown
            className="w-full my-2"
            value={this.state.totokenAddress}
            options={this.state.tokenlist}
            onChange={(e) => {
              this.setState({ totokenAddress: e.value, disableSwap: false });
            }}
            onBlur={() => this.getQuote()}
            placeholder="Select a Token"
            itemTemplate={this.itemTemplate}
            filter
            filterBy="label"
          />
          <div className="flex justify-content-evenly my-2">
            <InputText
              disabled={this.state.disableSwap}
              placeholder="0.0"
              className="w-full mr-1"
              value={this.state.amount2}
            />
            {/* <InputText className="w-full ml-1"  /> */}
            {/* {this.state.disableSwap && (
              <small id="username-help" className="p-error ml-3">
                {this.state.swapError}
              </small>
            )} */}
          </div>

          {this.state.displayFees && <div></div>}
          <span className="py-1 my-1">
            Estimated Gas:{' '}
            <b>{this.state.gasEstimate < 0.1 ? 0.1 : this.state.gasEstimate}</b>
          </span>
          <br />
          <span className="py-1 my-1">
            Slippage Fee: <b>1%</b>
          </span>
          <br />
          <span className="py-1 my-1">
            Offered By: <b>{this.state.protocol}</b>
          </span>

          <Button
            disabled={this.state.disableSwap}
            label="Swap"
            onClick={(e) => this.handleSwap(e)}
            className="my-2 w-full"
          />
        </Card>
      </div>
    );
  }
}

export default Swap;
