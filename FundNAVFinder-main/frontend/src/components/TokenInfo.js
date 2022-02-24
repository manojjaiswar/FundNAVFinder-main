import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { ProgressBar } from 'primereact/progressbar';
import { Chart } from 'primereact/chart';
import { SelectButton } from 'primereact/selectbutton';
import TokenInfoGraph from './TokenInfoGraph';
import { Card } from 'primereact/card';


let finalValue = 0;
let chartNum;

class TokenInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenId: props.match.params.id,
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
        }


    }

    componentDidMount = async () => {
        const tokenId = this.state.tokenId;

        const assets = await axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`)
        console.log(assets);

        const asset = {
            tokenImg: assets.data.image.small,
            tokenName: assets.data.name,
            tokenSym: assets.data.symbol
        }

        // const tokenImg = assets.data.image.small;
        // const tokenName = assets.data.name;
        // const tokenSym = assets.data.symbol;

        const maxData = await axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=max`)
        console.log(maxData);
        const maxPriceData = [];
        const maxTimeData = [];
        maxData.data.prices.map((item, index, array) => {
            maxPriceData.push(array[index][1])
            maxTimeData.push(moment(array[index][0]).format('YYYY-MM-DD, h:mm a'))
        })
        console.log(maxPriceData);
        console.log(maxTimeData);

        const oneYrData = await axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=366`)

        const oneYrPriceData = [];
        const oneYrTimeData = [];
        oneYrData.data.prices.map((item, index, array) => {
            oneYrPriceData.push(array[index][1])
            oneYrTimeData.push(moment(array[index][0]).format('YYYY-MM-DD, h:mm a'))
        })

        const oneMthData = await axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=30`)

        const oneMthPriceData = [];
        const oneMthTimeData = [];
        oneMthData.data.prices.map((item, index, array) => {
            oneMthPriceData.push(array[index][1])
            oneMthTimeData.push(moment(array[index][0]).format('YYYY-MM-DD, h:mm a'))
        })

        const oneWkData = await axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=7`)

        const oneWkPriceData = [];
        const oneWkTimeData = [];
        oneWkData.data.prices.map((item, index, array) => {
            oneWkPriceData.push(array[index][1])
            oneWkTimeData.push(moment(array[index][0]).format('YYYY-MM-DD, h:mm a'))
        })

        const oneDyData = await axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=1`)

        const oneDyPriceData = [];
        const oneDyTimeData = [];
        oneDyData.data.prices.map((item, index, array) => {
            oneDyPriceData.push(array[index][1])
            oneDyTimeData.push(moment(array[index][0]).format('YYYY-MM-DD, h:mm a'))
        })

        this.setState({
            maxPriceData: maxPriceData,
            maxTimeData: maxTimeData,
            oneYrPriceData: oneYrPriceData,
            oneYrTimeData: oneYrTimeData,
            oneMthPriceData: oneMthPriceData,
            oneMthTimeData: oneMthTimeData,
            oneWkPriceData: oneWkPriceData,
            oneWkTimeData: oneWkTimeData,
            oneDyPriceData: oneDyPriceData,
            oneDyTimeData: oneDyTimeData,
            assets: asset,
            loading: false
        })
    }

    componentDidUpdate() {
        let value = this.state.value;
        chartNum = value
    }




    render() {

        return (
            <div className="card">
                <div className="flex">
                    <img
                        src={this.state.tokenImg} alt=""
                        className="border-circle h-2rem w-2.5 mr-2"
                        onError={this.fallbackAvatar}
                    />
                    <div className="text-3xl">{this.state.tokenName}</div>
                </div>
                <div className="text-4xl font-semibold">{this.state.tokenSym}</div>
                {!this.state.loading ?
                    (<TokenInfoGraph
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

export default TokenInfo