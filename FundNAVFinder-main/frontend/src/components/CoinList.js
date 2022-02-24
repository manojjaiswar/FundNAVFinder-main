import React, { Component } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';



class CoinList extends Component {
    constructor() {
        super();
        this.state = {
            selectedRow: null,
            loading: true,
        }
    }

    componentDidMount = async () => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        const topData = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=7d')
        console.log(topData.data);
        console.log(topData);

        const data = []
        topData.data.map((item, index, array) => {
            const a = {
                name: array[index].name,
                symbol: array[index].symbol,
                price: formatter.format(array[index].current_price),
                logo: array[index].image,
                marketCap: formatter.format(array[index].market_cap),
                priceChangeSeven: array[index].price_change_percentage_7d_in_currency.toFixed(2),
                priceChange: array[index].price_change_percentage_24h.toFixed(2),
                totalVolume: formatter.format(array[index].total_volume),
                id: array[index].id
            };
            data.push(a)
        })

        console.log(data);
        this.setState({ data: data, loading: false })
    }

    tokenTemplate = (e) => {
        return (
            <div className="flex inline">
                <img src={e.logo} className="border-circle h-2rem w-2.5 mr-2" />
                <div>{`${e.name} (${e.symbol.toUpperCase()})`} </div>
            </div>
        );
    };

    sevenPriceChangeTemp = (e) => {
        if (e.priceChangeSeven > 0) {
            return (<div className="text-green-600" >{`${e.priceChangeSeven}%`}</div>)
        } else {
            return (<div style={{ color: 'red' }} >{`${e.priceChangeSeven}%`}</div>)

        }
    }

    priceChangeTemp = (e) => {
        if (e.priceChange > 0) {
            return (<div className="text-green-600" >{`${e.priceChange}%`}</div>)
        } else {
            return (<div style={{ color: 'red' }} >{`${e.priceChange}%`}</div>)

        }
    }

    onRowSelect = (event) => {
        // this.toast.current.show({ severity: 'info', summary: 'Token Selected', detail: `Name: ${event.data.token}`, life: 3000 });
        console.log(event.data.id)
        this.props.history.push(`/tokeninfo/${event.data.id}`)
    }


    render() {
        return (
            <div className="p-2 m-2">

                <div className="text-3xl text-bold mb-2 text-700">CoinList</div>
                {this.state.loading ? <Card className=""><ProgressBar mode="indeterminate" style={{ height: '6px' }} /></Card>
                    :
                    <Card>
                        <DataTable
                            value={this.state.data}
                            selection={this.state.selectedRow}
                            onSelectionChange={e => this.setState({ selectedRow: e.value })}
                            onRowSelect={this.onRowSelect}
                            selectionMode="single"
                        >
                            <Column field='' header='Token' body={this.tokenTemplate} />
                            <Column className='text-right' field='price' header='Price' />
                            <Column style={{ width: '70px' }} className='text-right' field='' body={this.priceChangeTemp} header='24H' />
                            <Column style={{ width: '70px' }} className='text-right' field='' header='7D' body={this.sevenPriceChangeTemp} />
                            <Column className='text-right' field='marketCap' header='Market Cap' />
                            <Column className='text-right' field='totalVolume' header='Total Volume' />
                        </DataTable>
                    </Card>}

            </div>

        )
    }
}

export default CoinList