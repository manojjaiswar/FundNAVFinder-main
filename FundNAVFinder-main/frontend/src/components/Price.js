import React, { Component } from 'react';
import axios from "axios";
import { Chart } from 'primereact/chart';
import Graph from "./Graph";
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import moment from 'moment';

class Price extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: props.match.params.contractAddress,
            chainId: props.match.params.chainId,
            maxPriceData: [],
            maxTimeData: [],
            oneYrPriceData: [],
            oneYrTimeData: [],
            oneMthPriceData: [],
            oneMthTimeData: [],
            oneWkPriceData: [],
            oneWkTimeData: [],
            oneDyPriceData: [],
            oneDyTimeData: [],
            assets: [],
            loading: true
        };
    }

    componentDidMount = async () => {
        console.log(this.state.address)
        const date = new Date();
        const fromDate = date.toISOString().split('T')[0]
        const toDate = new Date(date.setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]
        const contractAddress = this.state.address
        const chainId = this.state.chainId
        const chainName = () => {
            if (chainId == 1) {
                return 'ethereum'
            }
            if (chainId == 56) {
                return 'binance-smart-chain'
            }
            if (chainId == 137) {
                return 'polygon-pos'
            }
            if (chainId == 43114) {
                return 'avalanche'
            }
            if (chainId == 250) {
                return 'fantom'
            }
        }

        const asset = await axios.get(`https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/${chainId}/USD/${contractAddress}/?quote-currency=USD&format=JSON&key=ckey_de4ce317ca40408da5d8cdf7907`);

        console.log(asset)

        const assets = asset.data.data[0].prices[0].contract_metadata;
        console.log(assets);
        this.setState({ assets: assets })

        try {
            console.log('try');
            let oneYrData;
            let oneMthData;
            let oneDyData;
            let maxData;
            let oneWkData;
            if (contractAddress == '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
                oneDyData = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1');
                oneWkData = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7');
                oneMthData = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30');
                oneYrData = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=366');
                maxData = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=max');

            } else {
                oneWkData = await axios.get(`https://api.coingecko.com/api/v3/coins/${chainName()}/contract/${contractAddress}/market_chart/?vs_currency=usd&days=7`)
                oneDyData = await axios.get(`https://api.coingecko.com/api/v3/coins/${chainName()}/contract/${contractAddress}/market_chart/?vs_currency=usd&days=1`)
                oneMthData = await axios.get(`https://api.coingecko.com/api/v3/coins/${chainName()}/contract/${contractAddress}/market_chart/?vs_currency=usd&days=30`)
                oneYrData = await axios.get(`https://api.coingecko.com/api/v3/coins/${chainName()}/contract/${contractAddress}/market_chart/?vs_currency=usd&days=366`)
                maxData = await axios.get(`https://api.coingecko.com/api/v3/coins/${chainName()}/contract/${contractAddress}/market_chart/?vs_currency=usd&days=max`)
            }

            const oneDyPrice = [];
            const oneDyTime = [];

            oneDyData.data.prices.map((item, index, array) => {
                oneDyTime.push(moment(array[index][0]).format('YYYY-MM-DD, h:mm a'))
                oneDyPrice.push(array[index][1]);
            })

            console.log(oneDyPrice);
            console.log(oneDyTime);

            const oneWkPrice = [];
            const oneWkTime = [];

            oneWkData.data.prices.map((item, index, array) => {
                oneWkTime.push(moment(array[index][0]).format('YYYY-MM-DD, h:mm a'))
                oneWkPrice.push(array[index][1]);
            })
            console.log(oneWkTime);
            console.log(oneWkPrice);

            const oneMthPriceData = []
            const oneMthTimeData = []

            oneMthData.data.prices.map((item, index, array) => {
                oneMthTimeData.push(moment(array[index][0]).format('YYYY-MM-DD, h:mm a'));
                oneMthPriceData.push(array[index][1])
            })

            const oneYrPriceData = [];
            const oneYrTimeData = [];

            oneYrData.data.prices.map((item, index, array) => {
                oneYrTimeData.push(moment(array[index][0]).format('YYYY-MM-DD, h:mm a'));
                oneYrPriceData.push(array[index][1])
            })

            const maxPriceData = [];
            const maxTimeData = [];
            console.log(maxData);

            maxData.data.prices.map((item, index, array) => {
                maxTimeData.push(moment(array[index][0]).format('YYYY-MM-DD, h:mm a'));
                maxPriceData.push(array[index][1]);
            });

            console.log(maxPriceData);


            console.log(this.state.maxPriceData);
            this.setState({
                maxPriceData: maxPriceData,
                maxTimeData: maxTimeData,
                oneYrPriceData: oneYrPriceData,
                oneYrTimeData: oneYrTimeData,
                oneMthPriceData: oneMthPriceData,
                oneMthTimeData: oneMthTimeData,
                oneWkPriceData: oneWkPrice,
                oneWkTimeData: oneWkTime,
                oneDyPriceData: oneDyPrice,
                oneDyTimeData: oneDyTime,
                loading: false
            })
            // console.log(oneWkPrice);

        } catch {
            const oneWkData = await axios.get(`https://api.coingecko.com/api/v3/coins/${chainName()}/contract/${contractAddress}/market_chart/?vs_currency=usd&days=7`)

            const oneWkPrice = [];
            const oneWkTime = [];

            oneWkData.data.prices.map((item, index, array) => {
                oneWkTime.push(moment(array[index][0]).format('YYYY-MM-DD, h:mm a'))
                oneWkPrice.push(array[index][1]);
            })
            console.log(oneWkTime);
            console.log(oneWkPrice);

            this.setState({
                oneWkPriceData: oneWkPrice,
                oneWkTimeData: oneWkTime,
                oneDyPriceData: null,
                oneDyTimeData: null,
                loading: false
            })
            // let data = await axios.get(`https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/${chainId}/USD/${contractAddress}/?quote-currency=USD&format=JSON&from=${fromDate}&to=${toDate}&prices-at-asc=true&key=ckey_de4ce317ca40408da5d8cdf7907`)
        }


    }

    render() {
        return (

            <div className="card">
                {!this.state.loading ?
                    (<Graph
                        maxPriceData={this.state.maxPriceData}
                        maxTimeData={this.state.maxTimeData}
                        oneYrPriceData={this.state.oneYrPriceData}
                        oneYrTimeData={this.state.oneYrTimeData}
                        oneMthPriceData={this.state.oneMthPriceData}
                        oneMthTimeData={this.state.oneMthTimeData}
                        oneWkPriceData={this.state.oneWkPriceData}
                        oneWkTimeData={this.state.oneWkTimeData}
                        oneDyPriceData={this.state.oneDyPriceData}
                        oneDyTimeData={this.state.oneDyTimeData}
                        assets={this.state.assets}
                    />) : <Card className="col-10 col-offset-1"><ProgressBar mode="indeterminate" style={{ height: '6px' }} /></Card>}
            </div>
        )
    }
}

export default Price