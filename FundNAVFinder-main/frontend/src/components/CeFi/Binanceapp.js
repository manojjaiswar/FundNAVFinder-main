import React, { Component } from 'react'
import Moralis from 'moralis';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ToggleButton } from 'primereact/togglebutton';
import axios from 'axios';
import coin from '../../assets/coin.json'
import Cryptojs from 'crypto-js'
import { Constants } from '../../utils/Constants';
Moralis.start({
    serverUrl: 'https://f7mqa6kqgmvv.usemoralis.com:2053/server',
    appId: 'quQQbCVVZ4YpnZGO19HFLFZh6kwi6Uesn8WauriW',
});

export default class Binanceapp extends Component {
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
            checked: false,
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


        let cefiData, date, nav;

        if (data.data.results.cefiHistory !== undefined) {
            data.data.results.cefiHistory.map((item, index, array) => {
                if (array[index].cefi == 'binance') {
                    cefiData = array[index];
                }
            })

            if (cefiData) {

                date = cefiData.date.split('T')[0];

                nav = formatter.format(cefiData.nav)

                this.setState({ bdata: cefiData.data, apiNAV: nav, date: date })
            }

        }



    }


    importCSV = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const data = csv.split('\n');

            // Prepare DataTable
            const cols = data[0].replace(/['"]+/g, '').split(',');
            data.shift();
            let importedCols = cols.map(col => ({ field: col }));
            let importedData = data.map(d => {
                d = d.split(',');
                return cols.reduce((obj, c, i) => {
                    if (d[i] !== undefined) {
                        obj[c] = d[i].replace(/['"]+/g, '');
                        return obj;
                    }
                }, {});
            });
            this.setState({ importedCols: importedCols, importedData: importedData })
        };

        reader.readAsText(file, 'UTF-8');
        this.getAssets()
    }

    onSubmit = async () => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        const timestamp = (await axios.get("https://api.binance.com/api/v3/time")).data.serverTime
        const recvWindow = 60000
        const val = []
        const bdata = []
        if (this.state.checked === false) {
            const apiKey = this.state.apiKey
            const secretKey = this.state.secretKey
            const burl = "https://api.binance.us/"
            const dataQueryString = `recvWindow=${recvWindow}&timestamp=${timestamp}`
            const signature = Cryptojs.HmacSHA256(dataQueryString, secretKey).toString(Cryptojs.enc.Hex)
            const endpoint = 'api/v3/account?'
            const url = burl + endpoint + dataQueryString + '&signature=' + signature
            const data = await axios.post(`${Constants.BASE_URL}/getBinance`, { apiKey: apiKey, url: url })
            console.log(data)
            data.data.data.map(async (item, index, array) => {
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
        }
        else if (this.state.checked === true) {
            const apiKey = this.state.apiKey
            const secretKey = this.state.secretKey
            const burl = "https://api.binance.com/"
            const dataQueryString = `recvWindow=${recvWindow}&timestamp=${timestamp}`
            const signature = Cryptojs.HmacSHA256(dataQueryString, secretKey).toString(Cryptojs.enc.Hex)
            const endpoint = 'api/v3/account?'
            const url = burl + endpoint + dataQueryString + '&signature=' + signature
            const data = await axios.post(`${Constants.BASE_URL}/getBinance`, { apiKey: apiKey, url: url })
            console.log(data.data.data)
            data.data.data.map(async (item, index, array) => {
                console.log(array[index])
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
                        console.log(data)
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
        }
        console.log(bdata)
        setTimeout(() => {
            const reducer = (previousValue, currentValue) => previousValue + currentValue;
            const NAV = val.reduce(reducer)
            const nav = formatter.format(NAV)
            console.log(nav)
            this.setState({ apiNAV: nav })

        }, 3000);

        this.setState({ bdata: bdata })
    }

    getAssets = () => {
        coin.data.map(async (item, index, array) => {
            const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${array[index].id}&vs_currencies=usd`)
            Object.assign(array[index], { price: price.data[array[index].id].usd })
        })
        setTimeout(async () => {
            console.log(coin)
            const data = this.state.importedData
            const sell = []
            const buy = []
            const withdraw = []
            const deposit = []
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            data.map((item, index, array) => {
                if (array[index] !== undefined) {
                    if (array[index].Operation === 'Buy') {
                        const data = {
                            symbol: array[index].Base_Asset,
                            balance: array[index].Realized_Amount_For_Base_Asset,
                            id: array[index].Transaction_Id
                        }
                        buy.push(data)
                    }
                    if (array[index].Operation === 'Sell') {
                        const data = {
                            symbol: array[index].Base_Asset,
                            balance: array[index].Realized_Amount_For_Base_Asset,
                            id: array[index].Transaction_Id
                        }
                        sell.push(data)
                    }
                    if (array[index].Operation === 'Crypto Withdrawal') {
                        const data = {
                            symbol: array[index].Primary_Asset,
                            balance: array[index].Realized_Amount_For_Primary_Asset,
                            id: array[index].Transaction_Id
                        }
                        withdraw.push(data)
                    }
                    if (array[index].Operation === 'Crypto Deposit' || array[index].Operation === 'USD Deposit') {
                        const data = {
                            symbol: array[index].Primary_Asset,
                            balance: array[index].Realized_Amount_For_Primary_Asset,
                            id: array[index].Transaction_Id
                        }
                        deposit.push(data)
                    }
                }
            })
            buy.map((value, index, array) => {
                for (let i = 0; i < buy.length; i++) {
                    if (array[index].id !== buy[i].id) {
                        if (array[index].symbol === buy[i].symbol) {
                            array[index].balance = Number(buy[i].balance) + Number(array[index].balance)
                        }
                    }
                }
            })
            const a = buy.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === value.symbol
                ))
            )
            sell.map((value, index, array) => {
                for (let i = 0; i < sell.length; i++) {
                    if (array[index].id !== sell[i].id) {
                        if (array[index].symbol === sell[i].symbol) {
                            array[index].balance = Number(sell[i].balance) + Number(array[index].balance)
                        }
                    }
                }
            })
            const b = sell.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === value.symbol
                ))
            )
            a.map((value, index, array) => {
                b.map((v, i, a) => {
                    if (array[index].symbol === a[i].symbol) {
                        array[index].balance = Number(array[index].balance) - Number(a[i].balance)
                    }
                })
            })
            withdraw.map((value, index, array) => {
                for (let i = 0; i < withdraw.length; i++) {
                    if (array[index].id !== withdraw[i].id) {
                        if (array[index].symbol === withdraw[i].symbol) {
                            array[index].balance = Number(withdraw[i].balance) + Number(array[index].balance)
                        }
                    }
                }
            })
            const c = withdraw.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === value.symbol
                ))
            )
            a.map((value, index, array) => {
                c.map((v, i, a) => {
                    if (array[index].symbol === a[i].symbol) {
                        array[index].balance = Number(array[index].balance) - Number(a[i].balance)
                    }
                })
            })
            deposit.map((value, index, array) => {
                for (let i = 0; i < deposit.length; i++) {
                    if (array[index].id !== deposit[i].id) {
                        if (array[index].symbol === deposit[i].symbol) {
                            array[index].balance = Number(deposit[i].balance) + Number(array[index].balance)
                        }
                    }
                }
            })
            const d = deposit.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === value.symbol
                ))
            )
            a.map((value, index, array) => {
                d.map((v, i, a) => {
                    if (array[index].symbol === a[i].symbol) {
                        array[index].balance = Number(array[index].balance) + Number(a[i].balance)
                    }
                })
            })
            const e = []
            const val = []
            const date = new Date();
            let apiData;
            const today = date.toISOString().split('T')[0]
            a.map(async (item, index, array) => {
                try {
                    const sym = array[index].symbol.toUpperCase();
                    const price = (await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${sym}USDT`)).data.price
                    const data = {
                        token: array[index].symbol,
                        balance: array[index].balance.toFixed(3),
                        price: formatter.format(price),
                        value: formatter.format((price) * array[index].balance)
                    }
                    // console.log(data);
                    val.push((price) * array[index].balance)
                    e.push(data)
                }
                catch {
                    try {
                        const searchIndex = coin.data.findIndex((coin) => coin.symbol == array[index].symbol);
                        const price = coin.data[searchIndex].price
                        const data = {
                            token: array[index].symbol,
                            balance: array[index].balance.toFixed(3),
                            price: formatter.format(price),
                            value: formatter.format((price) * array[index].balance)
                        }
                        val.push((price) * array[index].balance)
                        e.push(data)
                    }
                    catch {
                        const price = await axios.get(`https://api.covalenthq.com/v1/pricing/historical/USD/${array[index].symbol}/?quote-currency=USD&format=JSON&from=${today}&to=${today}&prices-at-asc=true&key=ckey_ecf46a8674d649acb3cb172f4ad`)
                        const data = {
                            token: array[index].symbol,
                            balance: array[index].balance.toFixed(3),
                            price: formatter.format(price.data.data.prices[0].price),
                            value: formatter.format(price.data.data.prices[0].price * array[index].balance)
                        }
                        val.push((price.data.data.prices[0].price) * array[index].balance)
                        e.push(data)
                    }
                }
            })
            console.log(a)
            console.log(e)



            const reducer = (previousValue, currentValue) => previousValue + currentValue;
            setTimeout(() => {
                console.log(val)
                const NAV = val.reduce(reducer)

                const nav = formatter.format(NAV)
                console.log(nav)
                this.setState({ nav: nav, numNav: NAV })
                const bncData = JSON.stringify(e)
                window.localStorage.setItem('bncNav', NAV)
                window.localStorage.setItem('bncData', bncData)
            }, 2000);
            this.setState({ data: e, loading: false })
            console.log(e);
        }, 1000);



        setTimeout(async () => {
            console.log(this.state.numNav);
            const publicAddress = window.localStorage.getItem('publicAddress')

            await axios.post(`${Constants.BASE_URL}/cefiHistory`, {
                publicAddress: publicAddress,
                data: this.state.data,
                nav: this.state.numNav,
                cefi: 'binance'
            }).then((res) => {
                console.log(res);
            })

            console.log(this.state.data);
        }, 5000);

    }

    clear = () => {
        this.setState({
            importedData: [],
            importedCols: [],
            data: [],
            nav: null
        });
        document.getElementById('file1').value = null;
    }

    onImportSelectionChange(e) {
        this.setState({ selectedImportedData: e.value }, () => {
            const detail = this.state.selectedImportedData.map(d => Object.values(d)[0]).join(', ');
            this.toast.show({ severity: 'info', summary: 'Data Selected', detail, life: 3000 });
        });
    }

    onSelectionChange(e) {
        this.setState({ selectedProducts: e.value });
    }

    render() {
        return (
            <div>
                <h3>Get Assets by CSV</h3>
                <div className="flex justify-content-between my-2">
                    <InputText type="file" accept='.csv' id='file1' onChange={this.importCSV} />
                    <Button label='Clear' onClick={() => this.clear()} />
                </div>
                <div className="text-7xl font-bold mb-2 text-600">{this.state.nav}</div>
                <DataTable value={this.state.data} emptyMessage="Upload a Binance file">
                    <Column field='token' header='Token' />
                    <Column className='text-right' field='balance' header='Quantity' />
                    <Column className='text-right' field='price' header='Price' />
                    <Column className='text-right' field='value' header='Total Value' />
                </DataTable>
                <hr />
                <div>
                    <h3>Get Assets by API-KEY</h3>
                    <div className='flex justify-content-between my-3'>
                        <div>
                            <InputText placeholder='Api Key' className='m-1' value={this.state.apiKey} onChange={(e) => { this.setState({ apiKey: e.target.value }) }} />
                            <InputText placeholder='Secret Key' className='m-1' value={this.state.secretKey} onChange={(e) => { this.setState({ secretKey: e.target.value }) }} />
                            <ToggleButton checked={this.state.checked} onChange={(e) => this.setState({ checked: e.value })} onLabel="Binance.com" offLabel="Binance.us" onIcon="pi pi-globe" offIcon="pi pi-dollar" className='m-1' />
                        </div>
                        <div>
                            <Button label='Get' onClick={() => this.onSubmit()} />
                        </div>
                    </div>
                    <div className="text-7xl font-bold mb-2 text-600">{this.state.apiNAV}</div>
                    {this.state.date && <div className="text-right font-bold mb-1 text-600">Last Upload Date: {this.state.date}</div>}
                    <DataTable value={this.state.bdata} emptyMessage="No Assets">
                        <Column field='token' header='Token' />
                        <Column className='text-right' field='balance' header='Quantity' />
                        <Column className='text-right' field='price' header='Price' />
                        <Column className='text-right' field='value' header='Total Value' />
                    </DataTable>
                </div>
            </div>
        )
    }
}
