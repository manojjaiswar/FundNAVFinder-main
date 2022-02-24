import React, { Component } from 'react'
import { Chart } from 'primereact/chart';
import { SelectButton } from 'primereact/selectbutton';
import moment from 'moment';
import { Card } from 'primereact/card';
import img1 from '../assets/logos/coin1.png';

let finalValue = 0;
let chartNum;

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxPriceData: props.maxPriceData,
            maxTimeData: props.maxTimeData,
            oneYrPriceData: props.oneYrPriceData,
            oneYrTimeData: props.oneYrTimeData,
            oneMthPriceData: props.oneMthPriceData,
            oneMthTimeData: props.oneMthTimeData,
            oneWkPriceData: props.oneWkPriceData,
            oneWkTimeData: props.oneWkTimeData,
            oneDyPriceData: props.oneDyPriceData,
            oneDyTimeData: props.oneDyTimeData,
            assets: props.assets,
            value: 0,
        }

        this.basicData = [
            {
                labels: this.state.oneDyTimeData,
                datasets: [
                    {
                        label: '',
                        data: this.state.oneDyPriceData,
                        borderColor: '#3f51b5',
                        tension: 0,
                        fill: true,
                        pointRadius: 0,
                    },
                ]
            },
            {
                labels: this.state.oneWkTimeData,
                datasets: [
                    {
                        label: '',
                        data: this.state.oneWkPriceData,
                        borderColor: '#3f51b5',
                        tension: 0,
                        fill: true,
                        pointRadius: 0,

                    },
                ]
            },
            {
                labels: this.state.oneMthTimeData,
                datasets: [
                    {
                        label: '',
                        data: this.state.oneMthPriceData,
                        borderColor: '#3f51b5',
                        tension: 0,
                        fill: true,
                        pointRadius: 0,

                    },
                ]

            },
            {
                labels: this.state.oneYrTimeData,
                datasets: [
                    {
                        data: this.state.oneYrPriceData,
                        borderColor: '#3f51b5',
                        tension: 0,
                        fill: true,
                        pointRadius: 0,

                    },
                ]
            },
            {
                labels: this.state.maxTimeData,
                datasets: [
                    {
                        label: '',
                        data: this.state.maxPriceData,
                        borderColor: '#3f51b5',
                        tension: 0,
                        fill: true,
                        pointRadius: 0,

                    },
                ]
            },
        ];
        this.options = this.getLightTheme();


    }



    getLightTheme() {

        // console.log(this.state.oneYrPriceData);
        finalValue = this.state.oneYrPriceData[this.state.oneYrPriceData.length - 1].toFixed(2)

        let oneDyPriceData = this.state.oneDyPriceData;
        let oneWkPriceData = this.state.oneWkPriceData;
        let oneMthPriceData = this.state.oneMthPriceData;
        let oneYrPriceData = this.state.oneYrPriceData;
        let maxPriceData = this.state.maxPriceData;

        let percentChange;
        console.log(finalValue);
        console.log(this.state.oneYrTimeData);
        console.log(this.state.oneYrPriceData);
        console.log(this.state.oneMthPriceData);
        // console.log(this.state.oneWkPriceData);


        let basicOptions = {
            options: {
                scales: {
                    yAxes: [{
                        gridLines: {
                            drawBorder: false,
                        },
                    }]
                },
            },
            maintainAspectRatio: false,
            aspectRatio: .6,

            plugins: {
                legend: false,
                tooltip: {
                    intersect: false,
                    callbacks: {
                        afterFooter: function (chart) {
                            // console.log(chart[0].parsed.y);
                            // console.log(oneWkPriceData[0]);
                            // console.log(oneWkPriceData);
                            // console.log(chartNum);
                            if (chartNum === 0) {
                                percentChange = ((chart[0].parsed.y - oneDyPriceData[0]) / oneDyPriceData[0]) * 100
                            }
                            if (chartNum === 1) {
                                percentChange = ((chart[0].parsed.y - oneWkPriceData[0]) / oneWkPriceData[0]) * 100
                            }
                            if (chartNum === 2) {
                                percentChange = ((chart[0].parsed.y - oneMthPriceData[0]) / oneMthPriceData[0]) * 100
                            }
                            if (chartNum === 3) {
                                percentChange = ((chart[0].parsed.y - oneYrPriceData[0]) / oneYrPriceData[0]) * 100
                            }
                            if (chartNum === 4) {
                                percentChange = ((chart[0].parsed.y - maxPriceData[0]) / maxPriceData[0]) * 100
                            }

                            const change = document.getElementById('percentchange');

                            percentChange = percentChange.toFixed(2)
                            if (percentChange > 0) {
                                change.innerText = '🡡 ' + percentChange + '%';
                                change.style.color = 'green';
                            }
                            if (percentChange < 0) {
                                change.innerText = '🡣 ' + percentChange + '%';
                                change.style.color = 'red';
                            }

                            const time = document.getElementById('time')
                            // const a = chart[0].label
                            // const d = () => moment(a).format('dddd') + " " + moment(a).format('h:mm a')
                            // console.log(d);

                            let a = new Date(chart[0].label);

                            time.innerText = moment(a).format('MMMM D, Y, h:mm a');


                            const value = document.getElementById('value')
                            value.innerText = '$ ' + chart[0].parsed.y.toFixed(2)
                        },
                    }
                }

            },
            scales: {
                x: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        color: '#ffffff'
                    }
                },
                y: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        color: '#ffffff'
                    },
                    gridLines: {
                        drawBorder: false,
                    },

                }
            }
        }
        return {
            basicOptions,
        }
    }

    // fallbackAvatar = (e) => {
    //     e.target.src = this.state.fallback;
    // };

    componentDidMount() {
        console.log(this.state.oneWkPriceData)
        // console.log(this.state.oneDyPriceData);

    }

    componentDidUpdate() {
        let value = this.state.value;
        chartNum = value
    }

    render() {
        const assets = this.state.assets

        const chartOptions = [
            { name: '1D', value: 0 },
            { name: '1W', value: 1 },
            { name: '1M', value: 2 },
            { name: '1Y', value: 3 },
            { name: 'Max', value: 4 }
        ];


        const { basicOptions } = this.options;


        const mouseOut = () => {
            let a = document.getElementById('time');
            a.innerText = 'Current Price';
            let b = document.getElementById('value');
            b.innerText = '$ ' + finalValue;
            this.setState({ chartColor: '#3f51b5' })
            let c = document.getElementById('percentchange')
            c.innerText = ''
        }

        return (
            <div>
                <div className="bg-white py-4 px-1 border-round col-10 col-offset-1">
                    <div className="flex justify-content-between">
                        <div className="ml-2 mb-2">
                            <div className="flex">
                                <img
                                    src={assets.tokenImg} alt=""
                                    className="border-circle h-2rem w-2.5 mr-2"

                                />
                                <div className="text-3xl">{assets.tokenName}</div>
                            </div>
                            <div className="text-4xl font-semibold">{assets.tokenSym.toUpperCase()}</div>
                            <div id='time' className="font-semibold">Current Price</div>
                            <div id='value' className="inline mr-1 font-semibold text-2xl">${finalValue}</div>
                            <div id='percentchange' className="inline font-semibold text-2xl"></div>
                        </div>
                        <div className="text-right mt-7">
                            <SelectButton unselectable className="mr-2 inline" value={this.state.value} options={chartOptions} onChange={(e) => this.setState({ value: e.value })} optionLabel="name" />
                        </div>
                    </div>
                    <div onMouseOut={mouseOut} className="bg-white">
                        <Chart className="h-18rem" type="line" data={this.basicData[this.state.value]} options={basicOptions} />
                    </div>
                </div>
            </div>

        )
    }
}

export default Graph