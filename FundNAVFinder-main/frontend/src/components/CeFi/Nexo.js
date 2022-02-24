import React, { Component } from 'react'
import Base64 from 'crypto-js/enc-base64';
import CryptoJS, { HmacSHA256 } from 'crypto-js';
import Moralis from 'moralis';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Constants } from '../../utils/Constants';
import axios from 'axios'
import coin from '../../assets/coin.json'
Moralis.start({
    serverUrl: 'https://f7mqa6kqgmvv.usemoralis.com:2053/server',
    appId: 'quQQbCVVZ4YpnZGO19HFLFZh6kwi6Uesn8WauriW',
});



export default class Nexo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            importedCols: [],
            importedData: [],
            data: [],
            numNav: null,
            nav: null,
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
        const nav = formatter.format(cefiData.nav)
        const date = cefiData.date.split('T')[0];
        const nonce = Date.now()
        const secretKey = "255b7cbc-52c4-454c-9874-dd6be8bb858c"
        const signature = Base64.stringify(HmacSHA256(nonce, secretKey));
        console.log(signature)
        const nexoAPI = await axios.get("https://prime-api.prime-nexo.net/api/v1/accountSummary", {
            mode: 'no-cors',
            headers: {
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin,X-API-KEY,X-NONCE,X-SIGNATURE',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                "X-API-KEY": "32e90b6f-4c4c-410a-a759-008be66bcb49",
                "X-NONCE": nonce,
                "X-SIGNATURE": signature
            }
        })

        console.log(nexoAPI, 'aa')




        let cefiData;

        if (data.data.results.cefiHistory !== undefined) {
            data.data.results.cefiHistory.map((item, index, array) => {
                if (array[index].cefi == 'nexo') {
                    cefiData = array[index];
                }
            })
        }

        if (cefiData) {
            const nav = formatter.format(cefiData.nav)
            const date = cefiData.date.split('T')[0];

            this.setState({ data: cefiData.data, nav: nav, date: date })
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
                    obj[c] = d[i].replace(/['"]+/g, '');
                    return obj;
                }, {});
            });
            this.setState({ importedCols: importedCols, importedData: importedData })
        };

        reader.readAsText(file, 'UTF-8');
        this.getAssets()
    }

    getAssets = () => {
        coin.data.map(async (item, index, array) => {
            const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${array[index].id}&vs_currencies=usd`)
            Object.assign(array[index], { price: price.data[array[index].id].usd })
        })
        setTimeout(async () => {
            console.log(coin)
            const deposit = []
            const withdraw = []
            const interest = []
            const exchange = []
            const exdep = []
            const nav = []
            const data = (this.state.importedData)
            data.map((value, index, array) => {
                nav.push(Number(array[index]["USD Equivalent"].slice(1, array[index]["USD Equivalent"].length)))
                if (array[index].Type == "Deposit" || array[index].Type == "TransferFromPrimeWallet") {
                    deposit.push(array[index])
                }
                if (array[index].Type == "Withdrawal" || array[index].Type == "TransferToPrimeWallet") {
                    withdraw.push(array[index])
                }
                if (array[index].Type == "Interest") {
                    interest.push(array[index])
                }
                if (array[index].Type == "Exchange") {
                    exchange.push(array[index])
                }
                if (array[index].Type == "ExchangeDepositedOn") {
                    exdep.push(array[index])
                }
            })
            const a = []
            deposit.map((value, index, array) => {
                for (let i = 0; i < deposit.length; i++) {
                    if (array[index].Transaction !== deposit[i].Transaction) {
                        if (array[index].Currency === deposit[i].Currency) {
                            array[index].Amount = Number(deposit[i].Amount) + Number(array[index].Amount)
                        }
                    }
                }
            })
            deposit.map((value, index, array) => {
                for (let i = 0; i < deposit.length; i++) {
                    const find = (element) => element.Currency === deposit[i].Currency
                    const b = array.findIndex(find)
                    if (index == b) {
                        const d = {
                            symbol: array[index].Currency,
                            balance: Number(array[index].Amount)
                        }
                        a.push(d)
                    }
                }
            })
            const b = a.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === value.symbol
                ))
            )
            const c = []
            withdraw.map((value, index, array) => {
                for (let i = 0; i < withdraw.length; i++) {
                    if (array[index].Transaction !== withdraw[i].Transaction) {
                        if (array[index].Currency === withdraw[i].Currency) {
                            array[index].Amount = Number(withdraw[i].Amount) + Number(array[index].Amount)
                        }
                    }
                }
            })
            withdraw.map((value, index, array) => {
                for (let i = 0; i < withdraw.length; i++) {
                    const find = (element) => element.Currency === withdraw[i].Currency
                    const b = array.findIndex(find)
                    if (index == b) {
                        const d = {
                            symbol: array[index].Currency,
                            balance: Number(array[index].Amount)
                        }
                        c.push(d)
                    }
                }
            })
            const d = c.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === value.symbol
                ))
            )
            b.map((value, index, array) => {
                d.map((v, i, a) => {
                    if (array[index].symbol === a[i].symbol) {
                        array[index].balance = array[index].balance + a[i].balance
                    }
                })
            })
            const e = []
            interest.map((value, index, array) => {
                for (let i = 0; i < interest.length; i++) {
                    if (array[index].Transaction !== interest[i].Transaction) {
                        if (array[index].Currency === interest[i].Currency) {
                            array[index].Amount = Number(interest[i].Amount) + Number(array[index].Amount)
                        }
                    }
                }
            })
            interest.map((value, index, array) => {
                for (let i = 0; i < interest.length; i++) {
                    const find = (element) => element.Currency === interest[i].Currency
                    const b = array.findIndex(find)
                    if (index == b) {
                        const d = {
                            symbol: array[index].Currency,
                            balance: Number(array[index].Amount)
                        }
                        e.push(d)
                    }
                }
            })
            const f = e.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === value.symbol
                ))
            )
            b.map((value, index, array) => {
                f.map((v, i, a) => {
                    if (array[index].symbol === a[i].symbol) {
                        a[i].balance = array[index].balance + a[i].balance
                    }
                    else {
                        f.push(array[index])
                    }
                })
            })
            const g = f.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === value.symbol
                ))
            )
            const h = []
            exchange.map((value, index, array) => {
                const d = {
                    Transaction: array[index].Transaction,
                    Amount: array[index].Amount.split(' ')[1],
                    Currency: array[index].Currency.split('/')[1]
                }
                exchange.push(d)
                if (array[index].Currency.split('/')[0] === 'USDX') {
                    array[index].Amount = -array[index]['USD Equivalent'].slice(1)
                    array[index].Currency = array[index].Currency.split('/')[0]
                }

            })
            exdep.map((item, index, array) => {
                const d = {
                    Transaction: array[index].Transaction,
                    Amount: array[index].Amount,
                    Currency: array[index].Details.split('to ')[1],
                }
                exchange.push(d)
            })
            exchange.map((value, index, array) => {
                for (let i = 0; i < exchange.length; i++) {
                    if (array[index].Transaction !== exchange[i].Transaction) {
                        if (array[index].Currency === exchange[i].Currency) {
                            array[index].Amount = Number(exchange[i].Amount) + Number(array[index].Amount)
                        }
                    }
                }
            })
            exchange.map((value, index, array) => {
                for (let i = 0; i < exchange.length; i++) {
                    const find = (element) => element.Currency === exchange[i].Currency
                    const b = array.findIndex(find)
                    if (index == b) {
                        const d = {
                            symbol: array[index].Currency,
                            balance: Number(array[index].Amount)
                        }
                        h.push(d)
                    }
                }
            })
            console.log(h)


            const i = h.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === value.symbol
                ))
            )
            g.map((value, index, array) => {
                i.map((v, i1, a) => {
                    if (array[index].symbol === a[i1].symbol) {
                        a[i1].balance = array[index].balance + a[i1].balance
                    }
                    else {
                        a.push(array[index])
                    }
                })
            })
            const j = i.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === value.symbol
                ))
            )
            j.map((item, index, array) => {
                if (array[index].balance >= 0.00000001) {
                    array[index].balance = array[index].balance.toFixed(9)
                }
            })
            const k = []
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            const date = new Date();
            const today = date.toISOString().split('T')[0]
            const val = []
            j.map(async (item, index, array) => {
                try {
                    const sym = array[index].symbol.toUpperCase()
                    const price = await (await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${sym}USDT`)).data.price
                    const data = {
                        token: array[index].symbol,
                        balance: array[index].balance,
                        price: formatter.format(price),
                        value: formatter.format((price) * array[index].balance)
                    }
                    val.push((price) * array[index].balance)
                    k.push(data)
                }
                catch {
                    try {
                        const searchIndex = coin.data.findIndex((coin) => coin.symbol == array[index].symbol);
                        const price = coin.data[searchIndex].price
                        const data = {
                            token: array[index].symbol,
                            balance: array[index].balance,
                            price: formatter.format(price),
                            value: formatter.format((price) * array[index].balance)
                        }
                        val.push((price) * array[index].balance)
                        k.push(data)
                    }
                    catch {
                        const price = await axios.get(`https://api.covalenthq.com/v1/pricing/historical/USD/${array[index].symbol}/?quote-currency=USD&format=JSON&from=${today}&to=${today}&prices-at-asc=true&key=ckey_ecf46a8674d649acb3cb172f4ad`)
                        const data = {
                            token: array[index].symbol,
                            balance: array[index].balance,
                            price: formatter.format(price.data.data.prices[0].price),
                            value: formatter.format(price.data.data.prices[0].price * array[index].balance)
                        }
                        val.push((price.data.data.prices[0].price) * array[index].balance)
                        k.push(data)
                    }
                }
            })
            console.log(k)

            const reducer = (previousValue, currentValue) => previousValue + currentValue;
            setTimeout(() => {
                console.log(val)
                const NAV = val.reduce(reducer)
                const nav = formatter.format(NAV)
                console.log(nav)
                this.setState({ nav: nav, numNav: NAV })
                const data = JSON.stringify(k)
                window.localStorage.setItem('nexoNav', NAV)
                window.localStorage.setItem('nexoData', data)
            }, 2000);
            this.setState({ data: k })
            console.log(k);
        }, 1000);

        setTimeout(async () => {

            const publicAddress = window.localStorage.getItem('publicAddress')

            await axios.post(`${Constants.BASE_URL}/cefiHistory`, {
                publicAddress: publicAddress,
                data: this.state.data,
                nav: this.state.numNav,
                cefi: 'nexo'
            }).then((res) => {
                console.log(res);
            })
        }, 5000);


    }

    clear = () => {
        this.setState({
            importedData: [],
            importedCols: [],
            data: [],
            nav: ''
        });
        document.getElementById('file').value = null;
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
                <div className="flex justify-content-between my-2">
                    <InputText type="file" accept='.csv' id='file' onChange={this.importCSV} />
                    <Button label='Clear' onClick={() => this.clear()} />
                </div>
                {/* <DataTable value={this.state.importedData} emptyMessage="No data" paginator rows={10} alwaysShowPaginator={false} responsiveLayout="scroll">
                        {
                            this.state.importedCols.map((col, index) => <Column key={index} field={col.field} header={col.field} />)
                        }
                    </DataTable> */}
                <div className="text-7xl font-bold mb-2 text-600">{this.state.nav}</div>
                <div className="text-right font-bold mb-1 text-600">Last Upload Date: {this.state.date}</div>
                <DataTable value={this.state.data} emptyMessage="Upload a Nexo file">
                    <Column field='token' header='Token' />
                    <Column className='text-right' field='balance' header='Quantity' />
                    <Column className='text-right' field='price' header='Price' />
                    <Column className='text-right' field='value' header='Total Value' />
                </DataTable>
            </div>
        )
    }
}
