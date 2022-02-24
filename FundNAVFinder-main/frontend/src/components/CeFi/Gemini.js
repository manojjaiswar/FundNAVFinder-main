import React, { Component } from 'react';
import crypto from 'crypto'
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Constants } from "../../utils/Constants";

export default class Gemini extends Component {
    constructor(props) {
        super(props)
        this.state = {
            apiKey: '',
            secretKey: '',
            apiNAV: null,
            bdata: [],
            numNav: null,
            date: null
        }
    }

    componentDidMount = async () => {
        const publicAddress = window.localStorage.getItem("publicAddress")
        const data = await axios.get(
            `${Constants.BASE_URL}/getDetails/${publicAddress}`
        );

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        let cefiData, nav, date;

        if (data.data.results.cefiHistory !== undefined) {
            data.data.results.cefiHistory.map((item, index, array) => {
                if (array[index].cefi == 'gemini') {
                    cefiData = array[index];
                }
            })
        }
        if (cefiData) {
            nav = formatter.format(cefiData.nav)
            date = cefiData.date.split('T')[0];
            this.setState({ bdata: cefiData.data, apiNAV: nav, date: date })

        }

    }

    onSubmit = async () => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        const table = []
        const val = []
        const url = "https://api.gemini.com/v1/balances"
        const request = '/v1/balances'
        const api_key = this.state.apiKey
        const secret_key = this.state.secretKey
        const date = Date.now()
        const nonce = String(Math.floor(Date.now() / 1000) * 1000);
        const PAYLOAD = { request: request, nonce: nonce, account: "primary" };
        const ENCODED_PAYLOAD = Buffer.from(JSON.stringify(PAYLOAD)).toString("base64");
        const SIGNATURE = crypto.createHmac("sha384", secret_key).update(ENCODED_PAYLOAD).digest("hex");
        console.log(SIGNATURE, 'sig')
        const HEADERS = {
            "Content-Type": "application/json",
            'Access-Control-Allow-Headers': 'X-MBX-APIKEY',
            'X-GEMINI-APIKEY': api_key,
            "X-GEMINI-PAYLOAD": ENCODED_PAYLOAD,
            "X-GEMINI-SIGNATURE": SIGNATURE,
        };
        const balance = await axios({
            method: "post",
            url: url,
            headers: HEADERS,
        })

        balance.data.map(async (value, index, array) => {
            const price = (await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${array[index].currency}USDT`)).data.price
            const data = {
                token: array[index].currency,
                balance: array[index].amount,
                price: formatter.format(price),
                value: formatter.format((array[index].amount) * price)
            }
            val.push(array[index].amount * price)
            table.push(data)
        })
        console.log(val);


        setTimeout(async () => {
            const url1 = "https://api.gemini.com/v1/balances/earn"
            const request1 = '/v1/balances/earn'
            const nonce1 = String(Math.floor(Date.now() / 1000) * 1000);
            const PAYLOAD1 = { request: request1, nonce: nonce1, account: "primary" };
            const ENCODED_PAYLOAD1 = Buffer.from(JSON.stringify(PAYLOAD1)).toString("base64");
            const SIGNATURE1 = crypto.createHmac("sha384", secret_key).update(ENCODED_PAYLOAD1).digest("hex");
            const HEADERS1 = {
                "Content-Type": "application/json",
                'Access-Control-Allow-Headers': 'X-MBX-APIKEY',
                'X-GEMINI-APIKEY': api_key,
                "X-GEMINI-PAYLOAD": ENCODED_PAYLOAD1,
                "X-GEMINI-SIGNATURE": SIGNATURE1,
            };
            const balance1 = await axios({
                method: "post",
                url: url1,
                headers: HEADERS1,
            })
            console.log(balance1.data)
            const b = balance1.data
            // b.map((value, index, array) => {
            //     table.map((v, i, a) => {
            //         if (array[index].currency === a[i].token) {
            //             a[i].balance = a[i].balance + array[index].balance
            //             a[i].value = a[i].value + Number(array[index].balance * a[i].price)
            //             b.slice(index,1)
            //         }
            //     })
            // })
            // console.log(b)
            b.map(async (value, index, array) => {
                let price
                if (array[index] !== null) {
                    if (array[index].currency === "GUSD") {
                        price = (await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=USDCUSDT`)).data.price
                    }
                    else {
                        price = (await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${array[index].currency}USDT`)).data.price
                    }
                    const data = {
                        token: array[index].currency,
                        balance: array[index].balance,
                        price: formatter.format(price),
                        value: formatter.format(array[index].balance * price)
                    }
                    val.push(array[index].balance * price)
                    table.push(data)
                }

            })

            setTimeout(() => {

                const reducer = (previousValue, currentValue) => previousValue + currentValue;
                const NAV = val.reduce(reducer)

                const nav = formatter.format(NAV)
                this.setState({ apiNAV: nav, numNav: NAV })
            }, 2000);

            setTimeout(async () => {

                const publicAddress = window.localStorage.getItem('publicAddress')

                await axios.post(`${Constants.BASE_URL}/cefiHistory`, {
                    publicAddress: publicAddress,
                    data: this.state.bdata,
                    nav: this.state.numNav,
                    cefi: 'gemini'
                }).then((res) => {
                    console.log(res);
                })
            }, 5000);


            this.setState({ bdata: table })
        }, 500);

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
                    <div className="text-right font-bold mb-1 text-600">Last Upload Date: {this.state.date}</div>
                    <DataTable value={this.state.bdata} emptyMessage="No Assets">
                        <Column field='token' header='Token' />
                        <Column className='text-right' field='balance' header='Quantity' />
                        <Column className='text-right' field='price' header='Price' />
                        <Column className='text-right' field='value' header='Total Value' />
                    </DataTable>
                </div>
            </div>
        );
    }
}
