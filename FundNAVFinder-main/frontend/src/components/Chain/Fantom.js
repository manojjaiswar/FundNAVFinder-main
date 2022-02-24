import React, { Component } from 'react';
import axios from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import img1 from '../../assets/logos/coin1.png';

export default class Fantom extends Component {

  constructor(props) {
    super(props)
    this.state = {
      address: props.walletAddress,
      data: [],
      spa: [],
      hec: [],
      fan: [],
      fallback: img1
    }
  }

  async componentDidMount() {
    const balance = await axios.get(`https://api.covalenthq.com/v1/250/address/${this.state.address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_ecf46a8674d649acb3cb172f4ad`)
    console.log(balance.data.data.items)
    const table = []
    const spa = []
    const hec = []
    const fan = []
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    balance.data.data.items.map(async (value, index, array) => {
      if (array[index].balance !== "0") {
        const data = {
          logo: array[index].logo_url,
          token: array[index].contract_name,
          balance: `${(Number(array[index].balance) / Math.pow(10, array[index].contract_decimals)).toFixed(3)} ${array[index].contract_ticker_symbol}`,
          price: `${formatter.format(array[index].quote_rate)}`,
          value: `${formatter.format((Number(array[index].balance) / Math.pow(10, array[index].contract_decimals)) * array[index].quote_rate)}`,
          symbol: array[index].contract_ticker_symbol,
          contractAddress: array[index].contract_address,
        };
        if (data.contractAddress === "0x89346b51a54263cf2e92da79b1863759efa68692" || data.contractAddress === "0x8e2549225E21B1Da105563D419d5689b80343E01") {
          spa.push(data)
        }
        else if (data.contractAddress === "0x94ccf60f700146bea8ef7832820800e2dfa92eda" || data.contractAddress === "0x75bdeF24285013387A47775828bEC90b91Ca9a5F") {
          hec.push(data)
        }
        else if (data.contractAddress === "0x5E983ff70DE345de15DbDCf0529640F14446cDfa" || data.contractAddress === "0x73199ba57BBFe82a935B9C95850395d80a400937") {
          fan.push(data)
        }
        else if (data.value !== '$0.00') {
          if (
            data.token !== null &&
            data.token !== 'Wrapped sKLIMA' &&
            data.token !== 'Mina Protocol' &&
            data.token !== 'YFIN' &&
            data.token !== '$Hello' &&
            data.token !== 'Muon' &&
            data.token !== 'Minereum Polygon'
          ) {
            if (!data.token.includes('.')) {
              table.push(data);
            }
          }
        }
      }
    })
    this.setState({ data: table, spa: spa, hec: hec, fan: fan })
  }

  tokenTemplate = (e) => {
    return (
      <div className="flex inline">
        <img src={e.logo} onError={this.fallbackAvatar} className="border-circle h-2rem w-2.5 mr-2" />
        <div>{e.token}</div>
      </div>
    );
  };

  fallbackAvatar = (e) => {
    e.target.src = this.state.fallback;
  };

  render() {
    return (
      <div className='bg-white my-3'>
        {this.state.data.length !== 0 && (
          <div>
            <h2 className='m-2'>Fantom</h2>
            <div className='font-semibold m-2'>Wallet</div>
            <DataTable value={this.state.data} emptyMessage="No Assets">
              <Column field='token' header='Token' body={this.tokenTemplate}/>
              <Column className='text-right' field='balance' header='Quantity' />
              <Column className='text-right' field='price' header='Price' />
              <Column className='text-right' field='value' header='Total Value' />
            </DataTable>
          </div>
        )}
        {this.state.spa.length !== 0 && (
          <div>
            <div className='font-semibold m-2'>Spartacus DAO</div>
            <DataTable value={this.state.spa} emptyMessage="No Assets">
              <Column field='token' header='Token' body={this.tokenTemplate}/>
              <Column className='text-right' field='balance' header='Quantity' />
              <Column className='text-right' field='price' header='Price' />
              <Column className='text-right' field='value' header='Total Value' />
            </DataTable>
          </div>
        )}
        {this.state.hec.length !== 0 && (
          <div>
            <div className='font-semibold m-2'>Hector DAO</div>
            <DataTable value={this.state.hec} emptyMessage="No Assets">
              <Column field='token' header='Token' body={this.tokenTemplate}/>
              <Column className='text-right' field='balance' header='Quantity' />
              <Column className='text-right' field='price' header='Price' />
              <Column className='text-right' field='value' header='Total Value' />
            </DataTable>
          </div>
        )}
        {this.state.fan.length !== 0 && (
          <div>
            <div className='font-semibold m-2'>Fantohm DAO</div>
            <DataTable value={this.state.fan} emptyMessage="No Assets">
              <Column field='token' header='Token' body={this.tokenTemplate}/>
              <Column className='text-right' field='balance' header='Quantity' />
              <Column className='text-right' field='price' header='Price' />
              <Column className='text-right' field='value' header='Total Value' />
            </DataTable>
          </div>
        )}
      </div>
    )
  }
}
