import react, { Component } from "react";
import ChatBot from 'react-simple-chatbot';
import PropTypes from 'prop-types';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

class Token extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokens: null,
            loading: true,
        };
    }
    async componentWillMount() {
        const a = await axios.get("https://api.coingecko.com/api/v3/search/trending")
        console.log(a)
        const list = a.data.coins
        const table = []
        list.map(async (value, index, array) => {
            const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${array[index].item.id}&vs_currencies=usd`)
            const data = {
                rank: index,
                name: array[index].item.name,
                Symbol: array[index].item.symbol,
                price: price.data[array[index].item.id].usd.toFixed(2)
            }
            table.push(data)
        })
        console.log(table)
        setTimeout(() => {
            this.setState({ tokens: table, loading: false })
        }, 500);


    }
    render() {
        const tokens = this.state.tokens
        return (
            <div>
                {!this.state.loading && (
                    <DataTable value={tokens} responsiveLayout="scroll">
                        <Column field="name" header="Name"></Column>
                        <Column field="Symbol" header="Symbol"></Column>
                        <Column field="price" header="Price"></Column>
                    </DataTable>


                )}

            </div>

        )
    }




}

export default Token;