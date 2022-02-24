// import React, { Component } from 'react';
// import Web3 from 'web3';
// import axios from 'axios';
// import Moralis from 'moralis';
// import { Card } from 'primereact/card';
// import { Button } from 'primereact/button';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Skeleton } from 'primereact/skeleton';
// import { Dialog } from 'primereact/dialog';
// import { Toast } from 'primereact/toast';
// import Web3Logo from '../assets/web3assetmanager_logo.png';
// import ethLogo from '../assets/logos/eth.png';
// import bncLogo from '../assets/logos/bnc.png';
// import polyLogo from '../assets/logos/poly.png';
// import avaLogo from '../assets/logos/ava.png';
// import fanLogo from '../assets/logos/fan.png';
// import Nexo from './Nexo';
// import Celsius from './Celsius';
// import Test from './test';
// import { Constants } from '../utils/Constants';

// Moralis.start({
//   serverUrl: 'https://xiesgkgdkjyb.usemoralis.com:2053/server',
//   appId: 'M4BhZMBnB8ykPCigvxnsqsf8kR6XZUPbJb05atIe',
// });
// const web3 = new Web3(window.web3.currentProvider);
// let publicAddress;
// const drilling = [];
// const formatter = new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'USD',
// });

// class test extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: [],
//       chain: props.selectedChain,
//       ethereum: [],
//       binance: [],
//       polygon: [],
//       avalanche: [],
//       fantom: [],
//       nav: 0,
//       publicAddress: [],
//       address: [],
//       eth: [],
//       bsc: [],
//       matic: [],
//       avax: [],
//       ftm: [],
//       loading: false,
//       logging: false,
//       late: false,
//       alert: false,
//       mosambi: false,
//       wallet: null,
//       selectedAddress: props.selectedAddress,
//       selectedCurrency: 'usd',
//       currency: '',
//       table: undefined,
//       price: '',
//       token: undefined,
//       selectedProduct: null,
//       symbol: null,
//       update: props.loading,
//     };
//     this.cols = [
//       { field: 'symbol', header: 'Token' },
//       { field: 'balance', header: 'Quantity' },
//       { field: 'tPrice', header: 'Price' },
//       { field: 'tValue', header: 'Total Value' },
//     ];

//     this.exportColumns = this.cols.map((col) => ({
//       title: col.header,
//       dataKey: col.field,
//     }));
//     this.onChainChange = this.onChainChange.bind(this);
//   }
//   componentDidMount = async () => {
//     publicAddress = await window.ethereum.request({
//       method: 'eth_requestAccounts',
//     });
//     if (!publicAddress) {
//       window.alert('Please activate MetaMask first.');
//     }
//     this.setState({ publicAddress: publicAddress });
//     const address = await axios.get(`${Constants.BASE_URL}/getDetails`);
//     this.setState({ address: address.data.results.address });
//     const details = JSON.parse(window.localStorage.getItem('userDetail'));
//     // this.getResults();
//   };

//   componentDidUpdate = async (nextProps, prevState) => {
//     if (nextProps.selectedAddress.length !== prevState.selectedAddress.length) {
//       if (
//         prevState.selectedAddress.length !== this.state.selectedAddress.length
//       ) {
//         // this.getResults();
//       }
//     }
//     if (nextProps.selectedChain.length !== prevState.chain.length) {
//       if (prevState.chain.length !== this.state.chain.length) {
//         // this.getResults();
//       }
//     }
//     const address = await axios.get(`${Constants.BASE_URL}/getDetails`);
//     this.setState({ address: address.data.results.address });
//   };

//   static getDerivedStateFromProps(nextProps, prevState) {
//     if (nextProps.loading !== prevState.update) {
//       return {
//         update: nextProps.loading,
//         selectedAddress: nextProps.selectedAddress,
//         chain: nextProps.selectedChain,
//       };
//     } else {
//       return null;
//     }
//   }

//   getEthereum = async () => {
//     const ether = [];
//     const table = [];
//     const details = JSON.parse(window.localStorage.getItem('userDetail'));
//     const selectedAddress = this.state.selectedAddress;
//     selectedAddress.map(async (item, index, array) => {
//       const options = { chain: 'eth', address: array[index].code };
//       const balance = await Moralis.Web3API.account.getNativeBalance(options);
//       const cur = this.state.selectedCurrency;
//       const price = await axios.get(
//         `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${cur}`
//       );
//       let p;
//       const address = array[index];
//       // if (this.state.selectedCurrency == "usd") { p = `$ ${price.data.ethereum.usd}` }
//       // if (this.state.selectedCurrency == "eth") { p = `${price.data.ethereum.eth} ETH` }
//       // if (this.state.selectedCurrency == "inr") { p = `₹ ${price.data.ethereum.inr}` }
//       // if (this.state.selectedCurrency == "eur") { p = `€ ${price.data.ethereum.eur}` }
//       // if (this.state.selectedCurrency == "btc") { p = `${price.data.ethereum.btc} BTC` }
//       if (this.state.selectedCurrency == 'usd') {
//         p = price.data.ethereum.usd;
//       }
//       if (this.state.selectedCurrency == 'eth') {
//         p = price.data.ethereum.eth;
//       }
//       if (this.state.selectedCurrency == 'inr') {
//         p = price.data.ethereum.inr;
//       }
//       if (this.state.selectedCurrency == 'eur') {
//         p = price.data.ethereum.eur;
//       }
//       if (this.state.selectedCurrency == 'btc') {
//         p = price.data.ethereum.btc;
//       }
//       const data = {
//         symbol: 'ETH',
//         balance: balance.balance / Math.pow(10, 18),
//         price: p,
//         value: ((balance.balance / Math.pow(10, 18)) * p).toFixed(2),
//       };
//       const drill = {
//         address: address,
//         symbol: 'ETH',
//         balance: balance.balance / Math.pow(10, 18),
//         price: p,
//         value: ((balance.balance / Math.pow(10, 18)) * p).toFixed(2),
//         block: 'Ethereum',
//       };
//       drilling.push(drill);
//       const a = [];
//       const ethereum = [];
//       const eth = await Moralis.Web3API.account.getTokenBalances(options);
//       eth.map((value, index, array) => {
//         let p = array[index]['token_address'];
//         let sym = array[index]['symbol'];
//         let bal = [];
//         if (
//           array[index].balance / Math.pow(10, array[index].decimals) <
//           0.000001
//         ) {
//           bal = (
//             array[index].balance / Math.pow(10, array[index].decimals)
//           ).toFixed(9);
//         } else {
//           bal = array[index].balance / Math.pow(10, array[index].decimals);
//         }
//         a.push(p);
//         const drill = {
//           address: address,
//           symbol: sym,
//           balance: bal,
//           token: p,
//           block: 'Ethereum',
//         };
//         drilling.push(drill);
//         const data = {
//           symbol: sym,
//           balance: bal,
//           token: p,
//           block: 'Ethereum',
//           chain: (
//             <div className="flex justify-content-start">
//               <img
//                 className="p-1"
//                 src={ethLogo}
//                 style={{ height: '25px', width: '25px' }}
//               />
//               <label className="py-1 font-light">Ethereum</label>
//             </div>
//           ),
//           name: array[index]['name'],
//         };
//         if (sym.substring(sym.length - 3) != '.io') {
//           ethereum.push(data);
//         }
//       });
//       const b = [];
//       await axios
//         .get(
//           `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${a}&vs_currencies=${cur}`
//         )
//         .then(async (res) => {
//           b.push(res.data);
//         });
//       const c = b[0];
//       ether.unshift(data);
//       let v;
//       for (let i = 0; i < ethereum.length; i++) {
//         Object.entries(c).map(([key, value]) => {
//           // if (this.state.selectedCurrency == "usd") { v = `$ ${value.usd}` }
//           // if (this.state.selectedCurrency == "eth") { v = `${value.eth} ETH` }
//           // if (this.state.selectedCurrency == "inr") { v = `₹ ${value.inr}` }
//           // if (this.state.selectedCurrency == "eur") { v = `€ ${value.eur}` }
//           // if (this.state.selectedCurrency == "btc") { v = `${value.btc} BTC` }
//           if (this.state.selectedCurrency == 'usd') {
//             v = value.usd;
//           }
//           if (this.state.selectedCurrency == 'eth') {
//             v = value.eth;
//           }
//           if (this.state.selectedCurrency == 'inr') {
//             v = value.inr;
//           }
//           if (this.state.selectedCurrency == 'eur') {
//             v = value.eur;
//           }
//           if (this.state.selectedCurrency == 'btc') {
//             v = value.btc;
//           }
//           if (ethereum[i].token === key) {
//             if (v < 0.000001) {
//               Object.assign(ethereum[i], {
//                 price: v.toFixed(9),
//                 tPrice: formatter.format(v.toFixed(9)),
//               });
//             } else {
//               Object.assign(ethereum[i], {
//                 price: v,
//                 tPrice: formatter.format(v),
//               });
//             }
//             Object.assign(ethereum[i], {
//               value: (v * ethereum[i].balance).toFixed(2),
//               tValue: formatter.format((v * ethereum[i].balance).toFixed(2)),
//             });
//             if (ethereum[i].price !== undefined) {
//               ether.push(ethereum[i]);
//             }
//           }
//         });
//       }
//       for (let i = 0; i < ethereum.length; i++) {
//         if (ethereum[i].price === undefined && ethereum[i].symbol !== null) {
//           let v;
//           const options = {
//             address: ethereum[i].token,
//             chain: 'eth',
//           };
//           const price = await Moralis.Web3API.token
//             .getTokenPrice(options)
//             .catch((err) => {
//               v = 'fail';
//             });
//           if (v !== 'fail') {
//             v = price.usdPrice;
//             if (v < 0.000001) {
//               Object.assign(ethereum[i], {
//                 price: v.toFixed(9),
//                 tPrice: formatter.format(v.toFixed(9)),
//               });
//             } else {
//               Object.assign(ethereum[i], {
//                 price: v,
//                 tPrice: formatter.format(v),
//               });
//             }
//             Object.assign(ethereum[i], {
//               value: (v * ethereum[i].balance).toFixed(2),
//               tValue: formatter.format((v * ethereum[i].balance).toFixed(2)),
//             });
//             if (ethereum[i].price !== undefined) {
//               ether.push(ethereum[i]);
//             }
//           } else {
//             table.push(ethereum[i]);
//           }
//         }
//       }
//     });
//     const val = [];
//     const bal = [];
//     // const reducer = (previousValue, currentValue) => previousValue + currentValue;
//     // const NAV = val.reduce(reducer).toFixed(2);
//     this.setState({ eth: table });
//     this.setState({ ethereum: ether });
//   };

//   getBinance = async () => {
//     const ether = [];
//     const table = [];
//     const details = JSON.parse(window.localStorage.getItem('userDetail'));
//     const selectedAddress = this.state.selectedAddress;
//     selectedAddress.map(async (item, index, array) => {
//       const cur = this.state.selectedCurrency;
//       const options = { chain: 'bsc', address: array[index].code };
//       const balance = await Moralis.Web3API.account.getNativeBalance(options);
//       const price = await axios.get(
//         `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=${cur}`
//       );
//       const address = array[index];
//       let p;
//       if (this.state.selectedCurrency == 'usd') {
//         p = price.data.binancecoin.usd;
//       }
//       if (this.state.selectedCurrency == 'eth') {
//         p = price.data.binancecoin.eth;
//       }
//       if (this.state.selectedCurrency == 'inr') {
//         p = price.data.binancecoin.inr;
//       }
//       if (this.state.selectedCurrency == 'eur') {
//         p = price.data.binancecoin.eur;
//       }
//       if (this.state.selectedCurrency == 'btc') {
//         p = price.data.binancecoin.btc;
//       }
//       const data = {
//         symbol: 'BNB',
//         balance: balance.balance / Math.pow(10, 18),
//         price: p,
//         value: (balance.balance / Math.pow(10, 18)) * p,
//       };
//       const drill = {
//         address: address,
//         symbol: 'BNB',
//         balance: balance.balance / Math.pow(10, 18),
//         price: p,
//         value: ((balance.balance / Math.pow(10, 18)) * p).toFixed(2),
//         block: 'Binance',
//       };
//       drilling.push(drill);
//       const a = [];
//       const ethereum = [];
//       const eth = await Moralis.Web3API.account.getTokenBalances(options);
//       eth.map((value, index, array) => {
//         let p = array[index]['token_address'];
//         let sym = array[index]['symbol'];
//         let bal = [];
//         if (
//           array[index].balance / Math.pow(10, array[index].decimals) <
//           0.000001
//         ) {
//           bal = (
//             array[index].balance / Math.pow(10, array[index].decimals)
//           ).toFixed(9);
//         } else {
//           bal = array[index].balance / Math.pow(10, array[index].decimals);
//         }
//         a.push(p);
//         const drill = {
//           address: address,
//           symbol: sym,
//           balance: bal,
//           token: p,
//           block: 'Binance',
//         };
//         drilling.push(drill);
//         const data = {
//           symbol: sym,
//           balance: bal,
//           token: p,
//           block: 'Binance',
//           chain: (
//             <div className="flex justify-content-start">
//               <img
//                 className="p-1"
//                 src={bncLogo}
//                 style={{ height: '25px', width: '25px' }}
//               />
//               <label className="py-1 font-light">Binance</label>
//             </div>
//           ),
//           name: array[index]['name'],
//         };
//         if (sym.substring(sym.length - 3) != '.io') {
//           ethereum.push(data);
//         }
//       });
//       const b = [];
//       await axios
//         .get(
//           `https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=${a}&vs_currencies=${cur}`
//         )
//         .then(async (res) => {
//           b.push(res.data);
//         });
//       const c = b[0];
//       ether.unshift(data);
//       let v;
//       for (let i = 0; i < ethereum.length; i++) {
//         Object.entries(c).map(([key, value]) => {
//           if (this.state.selectedCurrency == 'usd') {
//             v = value.usd;
//           }
//           if (this.state.selectedCurrency == 'eth') {
//             v = value.eth;
//           }
//           if (this.state.selectedCurrency == 'inr') {
//             v = value.inr;
//           }
//           if (this.state.selectedCurrency == 'eur') {
//             v = value.eur;
//           }
//           if (this.state.selectedCurrency == 'btc') {
//             v = value.btc;
//           }
//           if (ethereum[i].token === key) {
//             if (v < 0.000001) {
//               Object.assign(ethereum[i], {
//                 price: v.toFixed(9),
//                 tPrice: formatter.format(v.toFixed(9)),
//               });
//             } else {
//               Object.assign(ethereum[i], {
//                 price: v,
//                 tPrice: formatter.format(v),
//               });
//             }
//             Object.assign(ethereum[i], {
//               value: (v * ethereum[i].balance).toFixed(2),
//               tValue: formatter.format((v * ethereum[i].balance).toFixed(2)),
//             });
//             if (ethereum[i].price !== undefined) {
//               ether.push(ethereum[i]);
//             }
//           }
//         });
//       }
//       for (let i = 0; i < ethereum.length; i++) {
//         if (ethereum[i].price === undefined && ethereum[i].symbol !== null) {
//           let v;
//           const options = {
//             address: ethereum[i].token,
//             chain: 'bsc',
//           };
//           const price = await Moralis.Web3API.token
//             .getTokenPrice(options)
//             .catch((err) => {
//               v = 'fail';
//             });
//           if (v !== 'fail') {
//             v = price.usdPrice;
//             if (v < 0.000001) {
//               Object.assign(ethereum[i], {
//                 price: v.toFixed(9),
//                 tPrice: v.toFixed(9),
//                 tPrice: formatter.format(v.toFixed(9)),
//               });
//             } else {
//               Object.assign(ethereum[i], {
//                 price: v,
//                 tPrice: v,
//                 tPrice: formatter.format(v),
//               });
//             }
//             Object.assign(ethereum[i], {
//               value: (v * ethereum[i].balance).toFixed(2),
//               tValue: formatter.format((v * ethereum[i].balance).toFixed(2)),
//             });
//             if (ethereum[i].price !== undefined) {
//               ether.push(ethereum[i]);
//             }
//           } else {
//             table.push(ethereum[i]);
//           }
//         }
//       }
//     });
//     this.setState({ bsc: table });
//     this.setState({ binance: ether });
//   };

//   getPolygon = async () => {
//     const ether = [];
//     const table = [];
//     const details = JSON.parse(window.localStorage.getItem('userDetail'));
//     const selectedAddress = this.state.selectedAddress;
//     selectedAddress.map(async (item, index, array) => {
//       const cur = this.state.selectedCurrency;
//       const options = { chain: 'polygon', address: array[index].code };
//       const balance = await Moralis.Web3API.account.getNativeBalance(options);
//       const price = await axios.get(
//         `https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=${cur}`
//       );
//       let p;
//       const address = array[index];
//       if (this.state.selectedCurrency == 'usd') {
//         p = price.data['matic-network'].usd;
//       }
//       if (this.state.selectedCurrency == 'eth') {
//         p = price.data['matic-network'].eth;
//       }
//       if (this.state.selectedCurrency == 'inr') {
//         p = price.data['matic-network'].inr;
//       }
//       if (this.state.selectedCurrency == 'eur') {
//         p = price.data['matic-network'].eur;
//       }
//       if (this.state.selectedCurrency == 'btc') {
//         p = price.data['matic-network'].btc;
//       }
//       const data = {
//         symbol: 'MATIC',
//         balance: balance.balance / Math.pow(10, 18),
//         price: p,
//         value: (balance.balance / Math.pow(10, 18)) * p,
//       };
//       const drill = {
//         address: address,
//         symbol: 'MATIC',
//         balance: balance.balance / Math.pow(10, 18),
//         price: p,
//         value: ((balance.balance / Math.pow(10, 18)) * p).toFixed(2),
//         block: 'Polygon',
//       };
//       drilling.push(drill);
//       const a = [];
//       const ethereum = [];
//       const eth = await Moralis.Web3API.account.getTokenBalances(options);
//       eth.map((value, index, array) => {
//         let p = array[index]['token_address'];
//         let sym = array[index]['symbol'];
//         let bal = [];
//         if (
//           array[index].balance / Math.pow(10, array[index].decimals) <
//           0.000001
//         ) {
//           bal = (
//             array[index].balance / Math.pow(10, array[index].decimals)
//           ).toFixed(9);
//         } else {
//           bal = array[index].balance / Math.pow(10, array[index].decimals);
//         }
//         a.push(p);
//         const drill = {
//           address: address,
//           symbol: sym,
//           balance: bal,
//           token: p,
//           block: 'Polygon',
//         };
//         drilling.push(drill);
//         const data = {
//           symbol: sym,
//           balance: bal,
//           token: p,
//           block: 'Polygon',
//           chain: (
//             <div className="flex justify-content-start">
//               <img
//                 className="p-1"
//                 src={polyLogo}
//                 style={{ height: '25px', width: '25px' }}
//               />
//               <label className="py-1 font-light">Polygon</label>
//             </div>
//           ),
//           name: array[index]['name'],
//         };
//         if (sym.substring(sym.length - 3) != '.io') {
//           ethereum.push(data);
//         }
//       });
//       const b = [];
//       await axios
//         .get(
//           `https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=${a}&vs_currencies=${cur}`
//         )
//         .then(async (res) => {
//           b.push(res.data);
//         });
//       const c = b[0];
//       ether.unshift(data);
//       let v;
//       for (let i = 0; i < ethereum.length; i++) {
//         Object.entries(c).map(([key, value]) => {
//           if (this.state.selectedCurrency == 'usd') {
//             v = value.usd;
//           }
//           if (this.state.selectedCurrency == 'eth') {
//             v = value.eth;
//           }
//           if (this.state.selectedCurrency == 'inr') {
//             v = value.inr;
//           }
//           if (this.state.selectedCurrency == 'eur') {
//             v = value.eur;
//           }
//           if (this.state.selectedCurrency == 'btc') {
//             v = value.btc;
//           }
//           if (ethereum[i].token === key) {
//             if (v < 0.000001) {
//               Object.assign(ethereum[i], {
//                 price: v.toFixed(9),
//                 tPrice: formatter.format(v.toFixed(9)),
//               });
//             } else {
//               Object.assign(ethereum[i], {
//                 price: v,
//                 tPrice: formatter.format(v),
//               });
//             }
//             Object.assign(ethereum[i], {
//               value: (v * ethereum[i].balance).toFixed(2),
//               tValue: formatter.format((v * ethereum[i].balance).toFixed(2)),
//             });
//             if (ethereum[i].price !== undefined) {
//               ether.push(ethereum[i]);
//             }
//           }
//         });
//       }
//       for (let i = 0; i < ethereum.length; i++) {
//         if (ethereum[i].price === undefined && ethereum[i].symbol !== null) {
//           let v;
//           const options = {
//             address: ethereum[i].token,
//             chain: 'polygon',
//           };
//           const price = await Moralis.Web3API.token
//             .getTokenPrice(options)
//             .catch((err) => {
//               v = 'fail';
//             });
//           if (v !== 'fail') {
//             v = price.usdPrice;
//             if (v < 0.000001) {
//               Object.assign(ethereum[i], {
//                 price: v.toFixed(9),
//                 tPrice: formatter.format(v.toFixed(9)),
//               });
//             } else {
//               Object.assign(ethereum[i], {
//                 price: v,
//                 tPrice: formatter.format(v),
//               });
//             }
//             Object.assign(ethereum[i], {
//               value: (v * ethereum[i].balance).toFixed(2),
//               tValue: formatter.format((v * ethereum[i].balance).toFixed(2)),
//             });
//             if (ethereum[i].price !== undefined) {
//               ether.push(ethereum[i]);
//             }
//           } else {
//             table.push(ethereum[i]);
//           }
//         }
//       }
//     });
//     this.setState({ matic: table });
//     this.setState({ polygon: ether });
//   };

//   getAvalanche = async () => {
//     const ether = [];
//     const table = [];
//     const details = JSON.parse(window.localStorage.getItem('userDetail'));
//     const selectedAddress = this.state.selectedAddress;
//     selectedAddress.map(async (item, index, array) => {
//       const cur = this.state.selectedCurrency;
//       const options = { chain: 'avalanche', address: array[index].code };
//       const balance = await Moralis.Web3API.account.getNativeBalance(options);
//       const price = await axios.get(
//         `https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=${cur}`
//       );
//       let p;
//       const address = array[index];
//       if (this.state.selectedCurrency == 'usd') {
//         p = price.data['avalanche-2'].usd;
//       }
//       if (this.state.selectedCurrency == 'eth') {
//         p = price.data['avalanche-2'].eth;
//       }
//       if (this.state.selectedCurrency == 'inr') {
//         p = price.data['avalanche-2'].inr;
//       }
//       if (this.state.selectedCurrency == 'eur') {
//         p = price.data['avalanche-2'].eur;
//       }
//       if (this.state.selectedCurrency == 'btc') {
//         p = price.data['avalanche-2'].btc;
//       }
//       const data = {
//         symbol: 'AVAX',
//         balance: balance.balance / Math.pow(10, 18),
//         price: p,
//         value: (balance.balance / Math.pow(10, 18)) * p,
//       };
//       const drill = {
//         address: address,
//         symbol: 'AVAX',
//         balance: balance.balance / Math.pow(10, 18),
//         price: p,
//         value: ((balance.balance / Math.pow(10, 18)) * p).toFixed(2),
//         block: 'Avalanche',
//       };
//       drilling.push(drill);
//       const a = [];
//       const ethereum = [];
//       const eth = await Moralis.Web3API.account.getTokenBalances(options);
//       eth.map((value, index, array) => {
//         let p = array[index]['token_address'];
//         let sym = array[index]['symbol'];
//         let bal = [];
//         if (
//           array[index].balance / Math.pow(10, array[index].decimals) <
//           0.000001
//         ) {
//           bal = (
//             array[index].balance / Math.pow(10, array[index].decimals)
//           ).toFixed(9);
//         } else {
//           bal = array[index].balance / Math.pow(10, array[index].decimals);
//         }
//         a.push(p);
//         const drill = {
//           address: address,
//           symbol: sym,
//           balance: bal,
//           token: p,
//           block: 'Avalanche',
//         };
//         drilling.push(drill);
//         const data = {
//           symbol: sym,
//           balance: bal,
//           token: p,
//           block: 'Avalanche',
//           chain: (
//             <div className="flex justify-content-start">
//               <img
//                 className="p-1"
//                 src={avaLogo}
//                 style={{ height: '25px', width: '25px' }}
//               />
//               <label className="py-1 font-light">Avalanche</label>
//             </div>
//           ),
//           name: array[index]['name'],
//         };
//         if (sym.substring(sym.length - 3) != '.io') {
//           ethereum.push(data);
//         }
//       });
//       const b = [];
//       await axios
//         .get(
//           `https://api.coingecko.com/api/v3/simple/token_price/avalanche?contract_addresses=${a}&vs_currencies=${cur}`
//         )
//         .then(async (res) => {
//           b.push(res.data);
//         });
//       const c = b[0];
//       ether.unshift(data);
//       let v;
//       for (let i = 0; i < ethereum.length; i++) {
//         Object.entries(c).map(([key, value]) => {
//           if (this.state.selectedCurrency == 'usd') {
//             v = value.usd;
//           }
//           if (this.state.selectedCurrency == 'eth') {
//             v = value.eth;
//           }
//           if (this.state.selectedCurrency == 'inr') {
//             v = value.inr;
//           }
//           if (this.state.selectedCurrency == 'eur') {
//             v = value.eur;
//           }
//           if (this.state.selectedCurrency == 'btc') {
//             v = value.btc;
//           }
//           if (ethereum[i].token === key) {
//             if (v < 0.000001) {
//               Object.assign(ethereum[i], {
//                 price: v.toFixed(9),
//                 tPrice: formatter.format(v.toFixed(9)),
//               });
//             } else {
//               Object.assign(ethereum[i], {
//                 price: v,
//                 tPrice: formatter.format(v),
//               });
//             }
//             Object.assign(ethereum[i], {
//               value: (v * ethereum[i].balance).toFixed(2),
//               tValue: formatter.format((v * ethereum[i].balance).toFixed(2)),
//             });
//             if (ethereum[i].price !== undefined) {
//               ether.push(ethereum[i]);
//             }
//           }
//         });
//       }
//       for (let i = 0; i < ethereum.length; i++) {
//         if (ethereum[i].price === undefined && ethereum[i].symbol !== null) {
//           let v;
//           const options = {
//             address: ethereum[i].token,
//             chain: 'avalanche',
//           };
//           const price = await Moralis.Web3API.token
//             .getTokenPrice(options)
//             .catch((err) => {
//               v = 'fail';
//             });
//           if (v !== 'fail') {
//             v = price.usdPrice;
//             if (v < 0.000001) {
//               Object.assign(ethereum[i], {
//                 price: v.toFixed(9),
//                 tPrice: formatter.format(v.toFixed(9)),
//               });
//             } else {
//               Object.assign(ethereum[i], {
//                 price: v,
//                 tPrice: formatter.format(v),
//               });
//             }
//             Object.assign(ethereum[i], {
//               value: (v * ethereum[i].balance).toFixed(2),
//               tValue: formatter.format((v * ethereum[i].balance).toFixed(2)),
//             });
//             if (ethereum[i].price !== undefined) {
//               ether.push(ethereum[i]);
//             }
//           } else {
//             table.push(ethereum[i]);
//           }
//         }
//       }
//     });
//     this.setState({ avax: table });
//     this.setState({ avalanche: ether });
//   };

//   getFantom = async () => {
//     const ether = [];
//     const table = [];
//     const details = JSON.parse(window.localStorage.getItem('userDetail'));
//     const selectedAddress = this.state.selectedAddress;
//     selectedAddress.map(async (item, index, array) => {
//       const cur = this.state.selectedCurrency;
//       const options = { chain: 'fantom', address: array[index].code };
//       const balance = await Moralis.Web3API.account.getNativeBalance(options);
//       const price = await axios.get(
//         `https://api.coingecko.com/api/v3/simple/price?ids=fantom&vs_currencies=${cur}`
//       );
//       let p;
//       const address = array[index];
//       if (this.state.selectedCurrency == 'usd') {
//         p = price.data['fantom'].usd;
//       }
//       if (this.state.selectedCurrency == 'eth') {
//         p = price.data['fantom'].eth;
//       }
//       if (this.state.selectedCurrency == 'inr') {
//         p = price.data['fantom'].inr;
//       }
//       if (this.state.selectedCurrency == 'eur') {
//         p = price.data['fantom'].eur;
//       }
//       if (this.state.selectedCurrency == 'btc') {
//         p = price.data['fantom'].btc;
//       }
//       const data = {
//         symbol: 'FTM',
//         balance: balance.balance / Math.pow(10, 18),
//         price: p,
//         value: (balance.balance / Math.pow(10, 18)) * p,
//       };
//       const drill = {
//         address: address,
//         symbol: 'FTM',
//         balance: balance.balance / Math.pow(10, 18),
//         price: p,
//         value: ((balance.balance / Math.pow(10, 18)) * p).toFixed(2),
//         block: 'Fantom',
//       };
//       drilling.push(drill);
//       const a = [];
//       const ethereum = [];
//       const eth = await Moralis.Web3API.account.getTokenBalances(options);
//       eth.map((value, index, array) => {
//         let p = array[index]['token_address'];
//         let sym = array[index]['symbol'];
//         let bal = [];
//         if (
//           array[index].balance / Math.pow(10, array[index].decimals) <
//           0.000001
//         ) {
//           bal = (
//             array[index].balance / Math.pow(10, array[index].decimals)
//           ).toFixed(9);
//         } else {
//           bal = array[index].balance / Math.pow(10, array[index].decimals);
//         }
//         a.push(p);
//         const drill = {
//           address: address,
//           symbol: sym,
//           balance: bal,
//           token: p,
//           block: 'Fantom',
//         };
//         drilling.push(drill);
//         const data = {
//           symbol: sym,
//           balance: bal,
//           token: p,
//           block: 'Fantom',
//           chain: (
//             <div className="flex justify-content-start">
//               <img
//                 className="p-1"
//                 src={fanLogo}
//                 style={{ height: '25px', width: '25px' }}
//               />
//               <label className="py-1 font-light">Fantom</label>
//             </div>
//           ),
//           name: array[index]['name'],
//         };
//         if (sym.substring(sym.length - 3) != '.io') {
//           ethereum.push(data);
//         }
//       });
//       const b = [];
//       await axios
//         .get(
//           `https://api.coingecko.com/api/v3/simple/token_price/fantom?contract_addresses=${a}&vs_currencies=${cur}`
//         )
//         .then(async (res) => {
//           b.push(res.data);
//         });
//       const c = b[0];
//       ether.unshift(data);
//       let v;
//       for (let i = 0; i < ethereum.length; i++) {
//         Object.entries(c).map(([key, value]) => {
//           if (this.state.selectedCurrency == 'usd') {
//             v = value.usd;
//           }
//           if (this.state.selectedCurrency == 'eth') {
//             v = value.eth;
//           }
//           if (this.state.selectedCurrency == 'inr') {
//             v = value.inr;
//           }
//           if (this.state.selectedCurrency == 'eur') {
//             v = value.eur;
//           }
//           if (this.state.selectedCurrency == 'btc') {
//             v = value.btc;
//           }
//           if (ethereum[i].token === key) {
//             if (v < 0.000001) {
//               Object.assign(ethereum[i], {
//                 price: v.toFixed(2),
//                 tPrice: formatter.format(v.toFixed(9)),
//               });
//             } else {
//               Object.assign(ethereum[i], {
//                 price: v,
//                 tPrice: formatter.format(v),
//               });
//             }
//             Object.assign(ethereum[i], {
//               value: (v * ethereum[i].balance).toFixed(2),
//               tValue: formatter.format((v * ethereum[i].balance).toFixed(2)),
//             });
//             if (ethereum[i].price !== undefined) {
//               ether.push(ethereum[i]);
//             }
//           }
//         });
//       }
//       for (let i = 0; i < ethereum.length; i++) {
//         if (ethereum[i].price === undefined && ethereum[i].symbol !== null) {
//           let v;
//           const options = {
//             address: ethereum[i].token,
//             chain: 'fantom',
//           };
//           const price = await Moralis.Web3API.token
//             .getTokenPrice(options)
//             .catch((err) => {
//               v = 'fail';
//             });
//           if (v !== 'fail') {
//             v = price.usdPrice;
//             if (v < 0.000001) {
//               Object.assign(ethereum[i], {
//                 price: v.toFixed(2),
//                 tPrice: formatter.format(v.toFixed(9)),
//               });
//             } else {
//               Object.assign(ethereum[i], {
//                 price: v,
//                 tPrice: formatter.format(v),
//               });
//             }
//             Object.assign(ethereum[i], {
//               value: (v * ethereum[i].balance).toFixed(2),
//               tValue: formatter.format((v * ethereum[i].balance).toFixed(2)),
//             });
//             if (ethereum[i].price !== undefined) {
//               ether.push(ethereum[i]);
//             }
//           } else {
//             table.push(ethereum[i]);
//           }
//         }
//       }
//     });
//     this.setState({ ftm: table });
//     this.setState({ fantom: ether });
//   };

//   calculateNav = () => {
//     const ethereum = this.state.ethereum;
//     const binance = this.state.binance;
//     const polygon = this.state.polygon;
//     const avalanche = this.state.avalanche;
//     const fantom = this.state.fantom;
//     const val = [];
//     const data = [];
//     const value = [];
//     const table = [];
//     const selectedAddress = this.state.selectedAddress;
//     const details = JSON.parse(window.localStorage.getItem('userDetail'));
//     const selectedChain = details.selectedChain;
//     selectedChain.map((item, index, array) => {
//       if (array[index].label === 'Ethereum') {
//         const price = [];
//         const bal = [];
//         this.state.eth.map((item, index, array) => {
//           table.push(array[index]);
//         });
//         ethereum.map((item, index, array) => {
//           if (array[index].symbol === 'ETH') {
//             value.push(
//               array[index].value
//                 .toString()
//                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//             );
//             bal.push(array[index].balance);
//             price.push(array[index].price);
//           }
//         });
//         const reducer = (previousValue, currentValue) =>
//           previousValue + currentValue;
//         const NAV1 = bal.reduce(reducer);
//         if (NAV1 !== 0) {
//           const db = {
//             name: 'Ethereum',
//             symbol: 'ETH',
//             balance: NAV1,
//             tPrice: formatter.format(price[0]),
//             value: (NAV1 * price[0]).toFixed(2),
//             tValue: formatter.format((NAV1 * price[0]).toFixed(2)),
//             price: price[0],
//             block: 'Ethereum',
//             chain: (
//               <div className="flex justify-content-start">
//                 <img
//                   className="p-1"
//                   src={ethLogo}
//                   style={{ height: '25px', width: '25px' }}
//                 />
//                 <label className="py-1 font-light">Ethereum</label>
//               </div>
//             ),
//           };
//           ethereum.splice(0, selectedAddress.length, db);
//           ethereum.map((item, index, array) => {
//             val.push(Number(array[index].value));
//             data.push(array[index]);
//           });
//         }
//       }
//       if (array[index].label === 'Binance') {
//         const price = [];
//         const bal = [];
//         this.state.bsc.map((item, index, array) => {
//           table.push(array[index]);
//         });
//         binance.map((item, index, array) => {
//           if (array[index].symbol === 'BNB') {
//             value.push(array[index].value);
//             bal.push(array[index].balance);
//             price.push(array[index].price);
//           }
//         });
//         const reducer = (previousValue, currentValue) =>
//           previousValue + currentValue;
//         const NAV1 = bal.reduce(reducer);
//         if (NAV1 !== 0) {
//           const db = {
//             symbol: 'BNB',
//             block: 'Binance',
//             balance: NAV1,
//             tPrice: formatter.format(price[0]),
//             value: (NAV1 * price[0]).toFixed(2),
//             tValue: formatter.format((NAV1 * price[0]).toFixed(2)),
//             price: price[0],
//             chain: (
//               <div className="flex justify-content-start">
//                 <img
//                   className="p-1"
//                   src={bncLogo}
//                   style={{ height: '25px', width: '25px' }}
//                 />
//                 <label className="py-1 font-light">Binance</label>
//               </div>
//             ),
//             name: 'Binance',
//           };
//           binance.splice(0, selectedAddress.length, db);
//           binance.map((item, index, array) => {
//             val.push(Number(array[index].value));
//             data.push(array[index]);
//           });
//         }
//       }
//       if (array[index].label === 'Polygon') {
//         const price = [];
//         const bal = [];
//         this.state.matic.map((item, index, array) => {
//           table.push(array[index]);
//         });
//         polygon.map((item, index, array) => {
//           if (array[index].symbol === 'MATIC') {
//             value.push(array[index].value);
//             bal.push(array[index].balance);
//             price.push(array[index].price);
//           }
//         });
//         const reducer = (previousValue, currentValue) =>
//           previousValue + currentValue;
//         const NAV1 = bal.reduce(reducer);
//         if (NAV1 !== 0) {
//           const db = {
//             symbol: 'MATIC',
//             block: 'Polygon',
//             balance: NAV1,
//             tPrice: formatter.format(price[0]),
//             value: (NAV1 * price[0]).toFixed(2),
//             tValue: formatter.format((NAV1 * price[0]).toFixed(2)),
//             price: price[0],
//             chain: (
//               <div className="flex justify-content-start">
//                 <img
//                   className="p-1"
//                   src={polyLogo}
//                   style={{ height: '25px', width: '25px' }}
//                 />
//                 <label className="py-1 font-light">Polygon</label>
//               </div>
//             ),
//             name: 'Matic',
//           };
//           polygon.splice(0, selectedAddress.length, db);
//           polygon.map((item, index, array) => {
//             val.push(Number(array[index].value));
//             data.push(array[index]);
//           });
//         }
//       }
//       if (array[index].label === 'Avalanche') {
//         const price = [];
//         const bal = [];
//         this.state.avax.map((item, index, array) => {
//           table.push(array[index]);
//         });
//         avalanche.map((item, index, array) => {
//           if (array[index].symbol === 'AVAX') {
//             value.push(array[index].value);
//             bal.push(array[index].balance);
//             price.push(array[index].price);
//           }
//         });
//         const reducer = (previousValue, currentValue) =>
//           previousValue + currentValue;
//         const NAV1 = bal.reduce(reducer);
//         if (NAV1 !== 0) {
//           const db = {
//             symbol: 'AVAX',
//             block: 'Avalanche',
//             balance: NAV1,
//             tPrice: formatter.format(price[0]),
//             value: (NAV1 * price[0]).toFixed(2),
//             tValue: formatter.format((NAV1 * price[0]).toFixed(2)),
//             price: price[0],
//             chain: (
//               <div className="flex justify-content-start">
//                 <img
//                   className="p-1"
//                   src={avaLogo}
//                   style={{ height: '25px', width: '25px' }}
//                 />
//                 <label className="py-1 font-light">Avalanche</label>
//               </div>
//             ),
//             name: 'Avalanche',
//           };
//           avalanche.splice(0, selectedAddress.length, db);
//           avalanche.map((item, index, array) => {
//             val.push(Number(array[index].value));
//             data.push(array[index]);
//           });
//         }
//       }
//       if (array[index].label === 'Fantom') {
//         const price = [];
//         const bal = [];
//         this.state.ftm.map((item, index, array) => {
//           table.push(array[index]);
//         });
//         fantom.map((item, index, array) => {
//           if (array[index].symbol === 'FTM') {
//             value.push(
//               array[index].value
//                 .toString()
//                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//             );
//             bal.push(array[index].balance);
//             price.push(array[index].price);
//           }
//         });
//         const reducer = (previousValue, currentValue) =>
//           previousValue + currentValue;
//         const NAV1 = bal.reduce(reducer);
//         if (NAV1 !== 0) {
//           const db = {
//             symbol: 'FTM',
//             block: 'Fantom',
//             balance: NAV1,
//             tPrice: formatter.format(price[0]),
//             value: (NAV1 * price[0]).toFixed(2),
//             tValue: formatter.format((NAV1 * price[0]).toFixed(2)),
//             price: price[0],
//             chain: (
//               <div className="flex justify-content-start">
//                 <img
//                   className="p-1"
//                   src={fanLogo}
//                   style={{ height: '25px', width: '25px' }}
//                 />
//                 <label className="py-1 ">Fantom</label>
//               </div>
//             ),
//             name: 'Fantom',
//           };
//           fantom.splice(0, selectedAddress.length, db);
//           fantom.map((item, index, array) => {
//             val.push(Number(array[index].value));
//             data.push(array[index]);
//           });
//         }
//       }
//     });
//     if (this.state.token !== undefined) {
//       this.setState({ mosambi: true });
//       val.push(Number(this.state.token.value));
//       data.push(this.state.token);
//     }
//     if (val.length !== 0) {
//       const reducer = (previousValue, currentValue) =>
//         previousValue + currentValue;

//       const NAV = val.reduce(reducer).toFixed(2);
//       var commas = NAV.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//       this.setState({ nav: commas });
//       // const nav = {
//       //     symbol: '',
//       //     balance: '',
//       //     price: 'Total NAV:',
//       //     value: `$${NAV}`
//       // }
//       // data.push(nav)
//       const test = [];
//       for (let i = 0; i < data.length; i++) {
//         for (let j = 0; j < data.length; j++) {
//           if (i !== j) {
//             if (data[i].symbol == data[j].symbol) {
//               let t;
//               if (data[i].block == data[j].block) {
//                 t = {
//                   symbol: data[i].symbol,
//                   price: data[i].price,
//                   balance: data[i].balance + data[j].balance,
//                   value: (
//                     data[i].price *
//                     (data[i].balance + data[j].balance)
//                   ).toFixed(2),
//                   tValue: formatter.format(
//                     (
//                       data[i].price *
//                       (data[i].balance + data[j].balance)
//                     ).toFixed(2)
//                   ),
//                   tPrice: data[i].tPrice,
//                   chain: [data[i].chain],
//                   block: data[i].block,
//                   name: data[i].name,
//                 };
//               } else {
//                 t = {
//                   symbol: data[i].symbol,
//                   price: data[i].price,
//                   balance: data[i].balance + data[j].balance,
//                   value: (
//                     data[i].price *
//                     (data[i].balance + data[j].balance)
//                   ).toFixed(2),
//                   tValue: formatter.format(
//                     (
//                       data[i].price *
//                       (data[i].balance + data[j].balance)
//                     ).toFixed(2)
//                   ),
//                   tPrice: data[i].tPrice,
//                   chain: [data[i].chain, data[j].chain],
//                   block: `${data[i].block},${data[j].block}`,
//                   name: data[i].name,
//                 };
//               }

//               data.push(t);
//               val.push();
//               data.splice(j, 1);
//               data.splice(i, 1);
//             }
//           }
//         }
//       }
//     }
//     this.setState({ data: data });
//     this.setState({ loading: true });
//     this.setState({ table: table });
//   };

//   onChainChange(e) {
//     let selectedChain = [...this.state.chain];

//     if (e.checked) selectedChain.push(e.value);
//     else selectedChain.splice(selectedChain.indexOf(e.value), 1);

//     this.setState({ chain: selectedChain, loading: false });
//   }

//   getDate = () => {
//     let today = new Date();
//     let day = `${today.getDate() < 10 ? '0' : ''}${today.getDate()}`;
//     let month = `${today.getMonth() + 1 < 10 ? '0' : ''}${
//       today.getMonth() + 1
//     }`;
//     let year = today.getFullYear();
//     let dateToday = `${day}/${month}/${year}`;
//     return dateToday;
//   };

//   getTime = () => {
//     let today = new Date();
//     let currentTime = today.toLocaleTimeString();
//     return currentTime;
//   };

//   downloadPDF = async () => {
//     // const options = {
//     //   chain: 'eth',
//     //   date: Date(),
//     // };
//     // const date = await Moralis.Web3API.native.getDateToBlock(options);
//     // const eth = await Moralis.Web3API.token.getTokenPrice({
//     //   address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
//     //   to_block: date.block,
//     // });
//     // console.log(eth);
//     // console.log(date.block);

//     console.log(this.state.address);
//     let today = new Date();
//     let day = `${today.getDate() < 10 ? '0' : ''}${today.getDate()}`;
//     let month = `${today.getMonth() + 1 < 10 ? '0' : ''}${
//       today.getMonth() + 1
//     }`;
//     let year = today.getFullYear();
//     let dateToday = `${day}/${month}/${year}`;

//     const selectedAddress = this.state.selectedAddress;

//     // console.log(selectedAddress[0].code);
//     // this.state.address.map((item, index, array) => {
//     //   for (let i = 0; i < selectedAddress.length; i++)
//     //     if (array[index].adrName === selectedAddress[i]) {
//     //       selectedAddress.splice(i, 1, array[index].walletAddress);
//     //     }
//     // });
//     const selectedAdd = selectedAddress.map((item, index, array) => {
//       return array[index].code;
//     });

//     let selectedAddLen = this.state.selectedAddress.length;
//     let selectedChain = [...this.state.chain];

//     let yAxis;
//     if (selectedAddLen > 5) {
//       yAxis = 50 + selectedAddLen * 2;
//     } else {
//       yAxis = 50;
//     }

//     const selectedChn = selectedChain.map((item, index, array) => {
//       return array[index].label;
//     });
//     console.log(selectedChn);

//     let totalNav = this.state.currency + this.state.nav;

//     import('jspdf').then((jsPDF) => {
//       import('jspdf-autotable').then(() => {
//         const doc = new jsPDF.default(0, 0);

//         var img = new Image();
//         img.src = Web3Logo;
//         doc.addImage(img, 'png', 10, 3, 40, 12);
//         doc.setFontSize(11);
//         doc.setTextColor(92, 92, 92);
//         doc.setFont(undefined, 'bold');
//         doc.text('Selected Addresses', 15, 25);
//         doc.setFontSize(10);
//         doc.setFont(undefined, 'normal');
//         doc.text(selectedAdd, 15, 30);
//         doc.setFont(undefined, 'bold');
//         doc.setFontSize(11);
//         doc.text('Selected Chains', 103, 25);
//         doc.setFont(undefined, 'normal');
//         doc.setFontSize(10);
//         doc.text(selectedChn, 103, 30);
//         doc.setFont(undefined, 'bold');
//         doc.text(this.getDate(), 164, 25);
//         doc.text(this.getTime(), 164, 30);
//         doc.setFontSize(11);
//         doc.text('Total NAV', 164, 40);
//         doc.setTextColor(30, 112, 0);
//         doc.setFont(undefined, 'bold');
//         doc.text(totalNav, 164, 45);
//         doc.setTextColor(92, 92, 92);
//         doc.setFont(undefined, 'normal');
//         doc.text(
//           'PrideVel Business Solutions LCC',
//           75,
//           doc.internal.pageSize.height - 10
//         );

//         doc.autoTable(this.exportColumns, this.state.data, {
//           theme: 'grid',
//           startY: yAxis,
//           showHead: 'everyPage',
//           columnStyles: { 0: { halign: 'left' } },
//           styles: {
//             halign: 'right',
//           },
//           head: ['heloo', 'hi', 'heloo', 'hi'],
//         });
//         doc.save(this.getDate() + '-Assets.pdf');
//       });
//     });
//   };

//   downloadCSV = () => {
//     import('xlsx').then((xlsx) => {
//       const worksheet = xlsx.utils.json_to_sheet(this.state.data);
//       worksheet.D1.v = 'Price';
//       worksheet.F1.v = 'Value';
//       worksheet['!cols'] = [];
//       worksheet['!cols'][4] = { hidden: true };
//       worksheet['!cols'][6] = { hidden: true };
//       worksheet['!cols'][7] = { hidden: true };
//       worksheet['!cols'][8] = { hidden: true };
//       const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
//       const excelBuffer = xlsx.write(workbook, {
//         bookType: 'xlsx',
//         type: 'array',
//       });
//       this.saveAsExcelFile(excelBuffer, 'assets');
//     });
//   };

//   saveAsExcelFile(buffer, fileName) {
//     import('file-saver').then((FileSaver) => {
//       let EXCEL_TYPE =
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//       let EXCEL_EXTENSION = '.xlsx';
//       const data = new Blob([buffer], {
//         type: EXCEL_TYPE,
//       });
//       FileSaver.saveAs(data, this.getDate() + '-Assets' + EXCEL_EXTENSION);
//     });
//   }

//   getResults = async () => {
//     drilling.splice(0, drilling.length);
//     // if (1==1) {
//     //   this.setState({ alert: true });
//     // } else {
//     this.setState({ loading: false });
//     this.setState({ logging: true });
//     const details = JSON.parse(window.localStorage.getItem('userDetail'));
//     const chain = details.selectedChain;
//     chain.map((value, index, array) => {
//       if (array[index].label === 'Ethereum') {
//         this.getEthereum();
//       }
//       if (array[index].label === 'Binance') {
//         this.getBinance();
//       }
//       if (array[index].label === 'Polygon') {
//         this.getPolygon();
//       }
//       if (array[index].label === 'Avalanche') {
//         this.getAvalanche();
//       }
//       if (array[index].label === 'Fantom') {
//         this.getFantom();
//       }
//     });
//     setTimeout(() => {
//       this.calculateNav();
//       this.setState({ logging: false });
//       console.log(drilling);
//     }, 7000);
//     let currency = this.state.selectedCurrency;
//     if (currency === 'usd') {
//       this.setState({ currency: '$' });
//     }
//     if (currency === 'inr') {
//       this.setState({ currency: '₹' });
//     }
//     if (currency === 'eur') {
//       this.setState({ currency: '€' });
//     }
//     if (currency === 'eth') {
//       this.setState({ currency: 'Ξ' });
//     }
//     if (currency === 'btc') {
//       this.setState({ currency: '₿' });
//     }
//   };

//   products = Array.from({ length: 5 });

//   bodyTemplate = () => {
//     if (this.state.loading === true) {
//       return <Skeleton animation="none"></Skeleton>;
//     }
//     return <Skeleton></Skeleton>;
//   };

//   addToken = (sym, bal) => {
//     const data = {
//       symbol: sym,
//       balance: bal,
//       price: Number(this.state.price),
//       value: (bal * this.state.price).toFixed(2),
//     };
//     console.log(data);
//     this.setState({ token: data });
//     this.getResults();
//   };

//   saveData = () => {
//     this.toast.show({
//       severity: 'success',
//       summary: 'Record Saved',
//       life: 3000,
//     });

//     const dataTable = this.state.data;
//     const nav = this.state.nav;
//     const data = [];
//     const selectedAddress = this.state.selectedAddress;
//     const selectedChain = this.state.chain;
//     dataTable.map((value, index, array) => {
//       const d = {
//         token: array[index].symbol,
//         balance: array[index].balance,
//         price: array[index].price,
//         value: array[index].value,
//         block: array[index].block,
//       };
//       data.push(d);
//     });
//     axios.post(`${Constants.BASE_URL}/saveData`, {
//       publicAddress: publicAddress,
//       data: data,
//       nav: nav,
//       selectedAddress: selectedAddress,
//       selectedChain: selectedChain,
//     });
//   };

//   onRowSelect(event) {
//     console.log(event.data.symbol);
//     this.onClick('displayMaximizable', 'center', event.data.symbol);
//   }

//   onRowUnselect(event) {
//     console.log('bye');
//   }

//   onClick = (name, position) => {
//     setTimeout(() => {
//       const symbol = this.state.selectedProduct.symbol;
//       const d = [];
//       drilling.map((value, index, array) => {
//         if (array[index].symbol === symbol) {
//           console.log(array[index]);
//           const data = {
//             symbol: array[index].symbol,
//             balance: array[index].balance,
//             block: array[index].block,
//             address: array[index].address.code,
//           };
//           d.push(data);
//         }
//       });
//       console.log(d);
//       this.setState({ symbol: d, late: true });
//     }, 1000);
//     let state = {
//       [`${name}`]: true,
//     };

//     if (position) {
//       state = {
//         ...state,
//         position,
//       };
//     }

//     this.setState(state);
//   };

//   onHide(name) {
//     this.setState({
//       [`${name}`]: false,
//       late: false,
//     });
//   }

//   quantityTemplate = (e) => {
//     return (
//       <div>
//         {Number(e.balance).toFixed(4)} {e.symbol}
//       </div>
//     );
//   };

//   priceTemplate = (e) => {
//     return <div>{formatter.format(e.price)}</div>;
//   };

//   valueTemplate = (e) => {
//     return <div>{formatter.format(e.value)}</div>;
//   };

//   tokenTemplate = (e) => {
//     return (
//       <div>
//         <div className="pb-1">
//           <b>{e.name}</b>
//         </div>
//         <div className="flex justify-content-start">
//           <small className="text-700">{e.chain}</small>
//           {/* <div className="text-sm text-center ml-1 mt-1">{e.block}</div> */}
//         </div>
//         {/* <div className="inline">{e.chain}</div>
//         <div className="text-sm m-2 p-2 inline">{e.block}</div> */}
//       </div>
//     );
//   };

//   render() {
//     const data = this.state.data;
//     const currency = [
//       { label: 'Dollar', value: 'usd' },
//       { label: 'Rupee', value: 'inr' },
//       { label: 'Euro', value: 'eur' },
//       { label: 'Ethereum', value: 'eth' },
//       { label: 'Bitcoin', value: 'btc' },
//     ];
//     return (
//       <div>
//         <Toast ref={(el) => (this.toast = el)} />
//         <div className="lg:col-10 lg:col-offset-1 md:col-8 md:col-offset-2 sm:col-12 sm:col-offset-0">
//           <h1 className="my-3">Dashboard</h1>
//           <Toast ref={(el) => (this.toast = el)} />
//           {/* {this.state.logging && (
//             <Card className="mt-4 shadow-4" id="focus">
//               <DataTable value={this.products} className="p-datatable">
//                 <Column
//                   field="code"
//                   header="Token"
//                   style={{ width: '25%' }}
//                   body={this.bodyTemplate}
//                 ></Column>
//                 <Column
//                   field="name"
//                   header="Quantity"
//                   style={{ width: '25%' }}
//                   body={this.bodyTemplate}
//                 ></Column>
//                 <Column
//                   field="category"
//                   header="Price"
//                   style={{ width: '25%' }}
//                   body={this.bodyTemplate}
//                 ></Column>
//                 <Column
//                   field="quantity"
//                   header="Value"
//                   style={{ width: '25%' }}
//                   body={this.bodyTemplate}
//                 ></Column>
//               </DataTable>
//             </Card>
//           )} */}
//           {/* {this.state.loading && (
//             <Card className="shadow-4">
//               {this.state.data.length === 0 && (
//                 <div className='text-center font-bold mb-2 text-600'><h1>No assets yet</h1></div>
//               )}
//               {this.state.data.length !== 0 && (
//                 <div>
//                  <div className="text-7xl font-bold mb-2 text-600">
//                 $ {this.state.nav}
//               </div> 
//               <div className="flex justify-content-between mb-2">
//                 <Button
//                   icon="pi pi-save"
//                   className="mr-1"
//                   label="Save as Record"
//                   onClick={this.saveData}
//                 />
//                 <div>
//                   <Button
//                     icon="pi pi-file-excel"
//                     className="p-button-raised mx-1"
//                     onClick={this.downloadCSV}
//                     tooltip="CSV"
//                     tooltipOptions={{
//                       className: 'indigo-tooltip',
//                       position: 'top',
//                     }}
//                   />
//                   <Button
//                     icon="pi pi-file-pdf"
//                     className="p-button-raised ml-1"
//                     onClick={this.downloadPDF}
//                     tooltip="PDF"
//                     tooltipOptions={{
//                       className: 'indigo-tooltip',
//                       position: 'top',
//                     }}
//                   />
//                 </div>
//               </div>
//               <div id="pdf">
//                 <Test />
//                 <DataTable
//                   selectionMode="single"
//                   value={data}
//                   className="p-datatable-lg"
//                   selection={this.state.selectedProduct}
//                   onSelectionChange={(e) =>
//                     this.setState({ selectedProduct: e.value })
//                   }
//                   onRowSelect={() =>
//                     this.onClick('displayMaximizable', 'center')
//                   }
//                   onRowUnselect={this.onRowUnselect}
//                   responsiveLayout="stack"
//                   scrollable
//                 >
//                   <Column
//                     className="text-left"
//                     field="name"
//                     header="Tokens"
//                     body={(e) => this.tokenTemplate(e)}
//                     sortable
//                   />
//                   <Column
//                     className="text-right"
//                     field="balance"
//                     header="Quantity"
//                     body={(e) => this.quantityTemplate(e)}
//                     sortable
//                   />
//                   <Column
//                     className="text-right"
//                     field="price"
//                     header={'Price ' + this.state.currency}
//                     body={(e) => this.priceTemplate(e)}
//                     sortable
//                   />
//                   <Column
//                     className="text-right"
//                     field="value"
//                     header={'Total Value ' + this.state.currency}
//                     body={(e) => this.valueTemplate(e)}
//                     sortable
//                   />
//                 </DataTable>
//                 </div>
//                 </div>
//               )}
//             </Card>
//           )} */}
//           <Card className="my-3 shadow-4">
//             <div className="text-7xl font-bold mb-2 text-700">Nexo</div>
//             <Nexo />
//           </Card>
//           <Card className="my-3 shadow-4">
//             <div className="text-7xl font-bold mb-2 text-700">Celsius</div>
//             <Celsius />
//           </Card>
//         </div>
//         {this.state.late && (
//           <Dialog
//             visible={this.state.displayMaximizable}
//             maximizable
//             modal
//             style={{ width: '70vw' }}
//             onHide={() => this.onHide('displayMaximizable')}
//           >
//             {this.state.symbol.map((value, index, array) => {
//               if (array[index].balance != 0) {
//                 return (
//                   <Card className="m-2 shadow-4">
//                     <div className="flex justify-content-between mb-1 mt-3">
//                       <small>SYMBOL</small>
//                       <small>CHAIN</small>
//                     </div>
//                     <div className="flex justify-content-between mb-3">
//                       <strong>{array[index].symbol}</strong>
//                       <strong>{array[index].block}</strong>
//                     </div>
//                     <div className="flex justify-content-between mb-1">
//                       <small>QUANTITY</small>
//                       <small>WALLET ADDRESS</small>
//                     </div>
//                     <div className="flex justify-content-between mb-3">
//                       <strong>{array[index].balance}</strong>
//                       <strong className="p-text-nowrap p-text-truncate">
//                         {array[index].address}
//                       </strong>
//                     </div>
//                   </Card>
//                 );
//               }
//             })}
//           </Dialog>
//         )}
//       </div>
//     );
//   }
// }

// export default test;
