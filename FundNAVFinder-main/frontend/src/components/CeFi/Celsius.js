import React, { Component } from 'react'
import Moralis from 'moralis';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Constants } from '../../utils/Constants';
import axios from 'axios';
import coin from '../../assets/coin.json'
Moralis.start({
    serverUrl: 'https://f7mqa6kqgmvv.usemoralis.com:2053/server',
    appId: 'quQQbCVVZ4YpnZGO19HFLFZh6kwi6Uesn8WauriW',
});

export default class Celsius extends Component {
    constructor(props) {
        super(props)
        this.state = {
            importedCols: [],
            importedData: [],
            data: [],
            nav: [],
            loading: true,
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
                if (array[index].cefi == 'celsius') {
                    cefiData = array[index];
                }
            })
        }

        if (cefiData) {

            nav = formatter.format(cefiData.nav)
            date = cefiData.date.split('T')[0];

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



    getAssets = () => {

        coin.data.map(async (item, index, array) => {
            const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${array[index].id}&vs_currencies=usd`)
            Object.assign(array[index], { price: price.data[array[index].id].usd })
        })
        setTimeout(async () => {
            console.log(coin)
            const data = this.state.importedData
            const withdraw = []
            const deposit = []
            const interest = []
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            data.map((item, index, array) => {
                if (array[index] !== undefined) {
                    if (array[index][" Coin type"] === 'withdrawal') {
                        withdraw.push(array[index])
                    }
                    if (array[index][" Coin type"] === 'deposit') {
                        deposit.push(array[index])
                    }
                    if (array[index][" Coin type"] === 'interest' || array[index][" Coin type"] === 'referred_award' || array[index][" Coin type"] === 'promo_code_reward') {
                        interest.push(array[index])
                    }
                }
            })
            const a = []
            deposit.map((value, index, array) => {
                for (let i = 0; i < deposit.length; i++) {
                    if (array[index]["Internal id"] !== deposit[i]["Internal id"]) {
                        if (array[index][" Coin amount"] === deposit[i][" Coin amount"]) {
                            array[index][" USD Value"] = Number(deposit[i][" USD Value"]) + Number(array[index][" USD Value"])
                        }
                    }
                }
            })
            deposit.map((value, index, array) => {
                for (let i = 0; i < deposit.length; i++) {
                    const find = (element) => element[" Coin amount"] === deposit[i][" Coin amount"]
                    const b = array.findIndex(find)
                    if (index == b) {
                        const d = {
                            symbol: array[index][" Coin amount"],
                            balance: Number(array[index][" USD Value"])
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
                    if (array[index]["Internal id"] !== withdraw[i]["Internal id"]) {
                        if (array[index][" Coin amount"] === withdraw[i][" Coin amount"]) {
                            array[index][" USD Value"] = Number(withdraw[i][" USD Value"]) + Number(array[index][" USD Value"])
                        }
                    }
                }
            })
            withdraw.map((value, index, array) => {
                for (let i = 0; i < withdraw.length; i++) {
                    const find = (element) => element[" Coin amount"] === withdraw[i][" Coin amount"]
                    const b = array.findIndex(find)
                    if (index == b) {
                        const d = {
                            symbol: array[index][" Coin amount"],
                            balance: Number(array[index][" USD Value"])
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
            console.log(interest)
            const e = []
            interest.map((value, index, array) => {
                for (let i = 0; i < interest.length; i++) {
                    if (array[index]["Internal id"] !== interest[i]["Internal id"]) {
                        if (array[index][" Coin amount"] === interest[i][" Coin amount"]) {
                            array[index][" USD Value"] = Number(interest[i][" USD Value"]) + Number(array[index][" USD Value"])
                        }
                    }
                }
            })
            interest.map((value, index, array) => {
                for (let i = 0; i < interest.length; i++) {
                    const find = (element) => element[" Coin amount"] === interest[i][" Coin amount"]
                    const b = array.findIndex(find)
                    if (index == b) {
                        const d = {
                            symbol: array[index][" Coin amount"],
                            balance: Number(array[index][" USD Value"])
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
            const val = []
            const date = new Date();
            const today = date.toISOString().split('T')[0]
            g.map(async (item, index, array) => {
                try {
                    const sym = array[index].symbol.toUpperCase()
                    const price = await (await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${sym}USDT`)).data.price
                    const data = {
                        token: array[index].symbol,
                        balance: array[index].balance.toFixed(3),
                        price: formatter.format(price),
                        value: formatter.format((price) * array[index].balance)
                    }
                    val.push((price) * array[index].balance)
                    h.push(data)
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
                        h.push(data)
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
                        h.push(data)
                    }
                }
            })
            console.log(h)

            const reducer = (previousValue, currentValue) => previousValue + currentValue;
            setTimeout(() => {
                console.log(val)
                const NAV = val.reduce(reducer)
                const nav = formatter.format(NAV)
                console.log(nav)
                this.setState({ nav: nav, numNav: NAV })
                const celData = JSON.stringify(h)
                window.localStorage.setItem('celsiusNav', NAV)
                window.localStorage.setItem('celsiusData', celData)
            }, 2000);



            this.setState({ data: h, loading: false })
        }, 1000);

        setTimeout(async () => {

            const publicAddress = window.localStorage.getItem('publicAddress')

            await axios.post(`${Constants.BASE_URL}/cefiHistory`, {
                publicAddress: publicAddress,
                data: this.state.data,
                nav: this.state.numNav,
                cefi: 'celsius'
            }).then((res) => {
                console.log(res);
            })
        }, 5000);
    }

    clear = () => {
        this.setState({
            importedData: [],
            importedCols: [],
            data: []
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
        if (this.state.loading === false) {
            // const formatter = new Intl.NumberFormat('en-US', {
            //     style: 'currency',
            //     currency: 'USD',
            //   });
            // const val = this.state.nav
            // const reducer = (previousValue, currentValue) => previousValue + currentValue;
            // console.log(val)
            // const NAV = val.reduce(reducer)
            // const nav = formatter.format(NAV)
            // console.log(nav)
        }
        return (
            <div>
                <div className="flex justify-content-between my-2">
                    <InputText type="file" accept='.csv' id='file1' onChange={this.importCSV} />
                    <Button label='Clear' onClick={() => this.clear()} />
                </div>
                {/* <DataTable value={this.state.importedData} emptyMessage="No data" paginator rows={10} alwaysShowPaginator={false} responsiveLayout="scroll">
                        {
                            this.state.importedCols.map((col, index) => <Column key={index} field={col.field} header={col.field} />)
                        }
                    </DataTable> */}
                <div className="text-7xl font-bold mb-2 text-600">{this.state.nav}</div>
                <div className="text-right font-bold mb-1 text-600">Last Upload Date: {this.state.date}</div>
                <DataTable value={this.state.data} emptyMessage="Upload a Celsius file">
                    <Column field='token' header='Token' />
                    <Column className='text-right' field='balance' header='Quantity' />
                    <Column className='text-right' field='price' header='Price' />
                    <Column className='text-right' field='value' header='Total Value' />
                </DataTable>
            </div>
        )
    }
}
