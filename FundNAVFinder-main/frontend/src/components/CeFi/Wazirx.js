import React, { Component } from 'react'
import Moralis from 'moralis';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import coin from '../../assets/coin.json'
import Cryptojs from 'crypto-js'
import { Constants } from '../../utils/Constants';

export default class Wazirx extends Component {
    constructor(props) {
        super(props)
        this.state = {
            importedCols: [],
            importedData: [],
            data: [],
            nav: [],
            apiKey: null,
            secretKey: null,
            loading: true,
            bdata: [],
            apiNAV: null,
            numNav: null,
        }
    }

    componentDidMount = async () => {
        const publicAddress = window.localStorage.getItem("publicAddress")
        const data = await axios.get(
            `${Constants.BASE_URL}/getDetails/${publicAddress}`
        );

        console.log(data);

        let cefiData, date, nav;

        if (data.data.results.cefiHistory !== undefined) {
            data.data.results.cefiHistory.map((item, index, array) => {
                if (array[index].cefi == 'wazirx') {
                    cefiData = array[index];
                }
            })
        }

        console.log(cefiData);
        this.setState({ cefiData: cefiData })

    }

    onSubmit = async () => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        const timestamp = (await axios.get("https://api.binance.com/api/v3/time")).data.serverTime
        const recvWindow = 60000
        const bdata = []
        const val = []
        const apiKey = this.state.apiKey
        const secretKey = this.state.secretKey
        const burl = "https://api.wazirx.com/"
        const dataQueryString = `recvWindow=${recvWindow}&timestamp=${timestamp}`
        const signature = Cryptojs.HmacSHA256(dataQueryString, secretKey).toString(Cryptojs.enc.Hex)
        const endpoint = 'sapi/v1/funds?'
        const url = burl + endpoint + dataQueryString + '&signature=' + signature
        const data = await axios.get(url, {
            mode: 'no-cors',
            headers: {
                // 'Access-Control-Allow-Headers':'Access-Control-Allow-Origin',
                'Access-Control-Allow-Headers': 'X-MBX-APIKEY',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                // "Access-Control-Allow-Credentials": "true",
                'X-MBX-APIKEY': apiKey
            },
            credentials: 'same-origin',
        })
        data.data.balances.map(async (item, index, array) => {
            array[index].free = Number(array[index].free).toFixed(2)
            array[index].locked = Number(array[index].locked).toFixed(2)
            if (array[index].free !== '0.00' || array[index].locked !== '0.00') {
                if (array[index].asset === 'USDT' || array[index].asset === 'USD') {
                    const data = {
                        asset: array[index].asset,
                        balance: array[index].free,
                        price: formatter.format(1.00),
                        value: formatter.format(1.00 * Number(array[index].free))
                    }
                    val.push(1 * Number(array[index].free))
                    bdata.push(data)
                }
                else {
                    const price = (await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${array[index].asset}USDT`)).data.price
                    const data = {
                        asset: array[index].asset,
                        balance: array[index].free,
                        price: formatter.format(price),
                        value: formatter.format(price * Number(array[index].free))
                    }
                    val.push(price * Number(array[index].free))
                    bdata.push(data)
                }
            }
        })
        console.log(bdata)
        setTimeout(() => {
            const reducer = (previousValue, currentValue) => previousValue + currentValue;
            const NAV = val.reduce(reducer)
            const nav = formatter.format(NAV)
            console.log(nav)
            this.setState({ apiNAV: nav, numNav: NAV })

        }, 3000);

        setTimeout(async () => {

            const publicAddress = window.localStorage.getItem('publicAddress')

            await axios.post(`${Constants.BASE_URL}/cefiHistory`, {
                publicAddress: publicAddress,
                data: this.state.data,
                nav: this.state.numNav,
                cefi: 'wazirx'
            }).then((res) => {
                console.log(res);
            })
        }, 5000);

        this.setState({ bdata: bdata })
    }

    render() {
        return (
            <div>
                <div>
                    <h3>Get Assets by API-KEY</h3>
                    <div className='flex justify-content-between my-3'>
                        <div>
                            <InputText placeholder='Api Key' className='m-1' value={this.state.apiKey} onChange={(e) => { this.setState({ apiKey: e.target.value }) }} />
                            <InputText placeholder='Secret Key' className='m-1' value={this.state.secretKey} onChange={(e) => { this.setState({ secretKey: e.target.value }) }} />
                        </div>
                        <div>
                            <Button label='Get' onClick={() => this.onSubmit()} />
                        </div>
                    </div>
                    <div className="text-7xl font-bold mb-2 text-600">{this.state.apiNAV}</div>
                    <DataTable value={this.state.bdata} emptyMessage="No Assets">
                        <Column field='asset' header='Token' />
                        <Column className='text-right' field='balance' header='Quantity' />
                        <Column className='text-right' field='price' header='Price' />
                        <Column className='text-right' field='value' header='Total Value' />
                    </DataTable>
                </div>
            </div>
        )
    }
}
