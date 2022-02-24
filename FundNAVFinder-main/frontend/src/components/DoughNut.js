import React, { Component } from 'react';
import { Chart } from 'primereact/chart';

class CoinList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chainData: props.chainData,
            navData: props.navData
        }

        this.chartData = {
            labels: this.state.chainData,
            datasets: [
                {
                    data: this.state.navData,
                    label: '',
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4f46ef"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4f46ef"
                    ]
                }]
        };

        this.lightOptions = {
            plugins: {
                legend: false,
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.label;
                            return label;
                        }
                    }

                }
            }
        };
    }

    componentDidMount = async () => {
        console.log(this.state.data);
    }


    render() {
        return (
            <Chart className="w-7rem" type="doughnut" data={this.chartData} options={this.lightOptions} style={{ position: 'relative', width: '40%' }} />
        )
    }
}

export default CoinList