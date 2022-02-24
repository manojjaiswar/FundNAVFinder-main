import React, { Component } from 'react'
import Web3 from 'web3';
import axios from 'axios';
import Moralis from 'moralis';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Constants } from '../utils/Constants';
import { Dropdown } from 'primereact/dropdown';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';


Moralis.start({
    serverUrl: 'https://kz6gugt8lfij.usemoralis.com:2053/server',
    appId: 'MEoK7FwOuiRN4pTMQbSBOrDfvD29XvGqfu8avXDA',
});
class Transaction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            walletAddress: props.walletAddress,
            copied: false,
            saveBtnTooltipText: '',
            globalFilter: ''
        }


    }

    componentDidMount = async () => {
        const b = await axios.get(`https://api.zapper.fi/v1/transactions?address=0x2d74c87461F08b0914fcC5194bE006209C6F7C5a&addresses%5B%5D=${this.state.walletAddress}&api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241`)
        console.log(b.data.data)
        const table = []
        b.data.data.map((value, index, array) => {
            const date = new Date(array[index].timeStamp * 1000)
            const today = date.getDate()
            if (array[index].name === "Send") {
                const data = {
                    date: date.toLocaleString(),
                    network: array[index].network,
                    type: array[index].name,
                    address: array[index].destination,
                    amount: - array[index].subTransactions[0].amount,
                    coin: array[index].subTransactions[0].symbol,
                    gas: array[index].gas,
                    hash: array[index].hash
                }
                table.push(data)
            }
            if (array[index].name === "Receive") {
                const data = {
                    date: date.toLocaleString(),
                    network: array[index].network,
                    type: array[index].name,
                    address: array[index].from,
                    amount: + array[index].subTransactions[0].amount,
                    coin: array[index].subTransactions[0].symbol,
                    hash: array[index].hash
                }
                table.push(data)
            }
            if (array[index].name === "Exchange") {
                const data = {
                    date: date.toLocaleString(),
                    network: array[index].network,
                    type: array[index].name,
                    address: array[index].destination,
                    amount1: + array[index].subTransactions[0].amount,
                    coin1: array[index].subTransactions[0].symbol,
                    amount2: - array[index].subTransactions[1].amount,
                    coin2: array[index].subTransactions[1].symbol,
                    gas: array[index].gas,
                    hash: array[index].hash
                }
                table.push(data)
            }
        })
        console.log(table)
        this.setState({ data: table })
    }

    showSuccess() {
        this.toast.show({
            severity: 'success',
            summary: 'Copied!',
            detail: '',
            life: 1500,
        });
    }

    columnOne = (e) => {
        return (
            <div>
                <div className='font-bold'>{e.date.split(',')[0]}</div>
                <div>
                    <div>{e.hash.slice(0, 6)}...{e.hash.slice(63)}
                        <CopyToClipboard text={e.hash} onCopy={() => this.setState({ copied: true })}>
                            <i style={{ cursor: 'pointer' }} className="pi pi-copy ml-1 mt-1 text-sm" tooltip={this.state.saveBtnTooltipText}
                                onClick={() => {
                                    this.setState({ saveBtnTooltipText: 'Copied!' });
                                    this.showSuccess();
                                }} ></i>
                        </CopyToClipboard>
                    </div>
                    <small>{e.network.toUpperCase()}</small>
                </div>
            </div>
        )
    }

    columnTwo = (e) => {
        if (e.type === "Send") {
            return (
                <div>
                    <div>
                        <div className='flex'>
                            <div className='mr-1 mt-1 font-bold text-sm'>{e.type}</div>
                            <div className='pi pi-arrow-circle-right mt-1'></div>
                        </div>
                        <div className='text-left'>{e.address.slice(0, 6)}...{e.address.slice(38)}
                            <CopyToClipboard text={e.address} onCopy={() => this.setState({ copied: true })}>
                                <i style={{ cursor: 'pointer' }} className="pi pi-copy ml-1 mt-1 text-sm" tooltip={this.state.saveBtnTooltipText}
                                    onClick={() => {
                                        this.setState({ saveBtnTooltipText: 'Copied!' });
                                        this.showSuccess();
                                    }} ></i>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
            )
        }
        else if (e.type === "Receive") {
            return (
                <div>
                    <div>
                        <div className='flex'>
                            <div className='mr-1 mt-1 font-bold text-sm'>{e.type}</div>
                            <div className='pi pi-arrow-circle-left mt-1'></div>
                        </div>
                        <div className='text-left'>{e.address.slice(0, 6)}...{e.address.slice(38)}
                            <CopyToClipboard text={e.address} onCopy={() => this.setState({ copied: true })}>
                                <i style={{ cursor: 'pointer' }} className="pi pi-copy ml-1 mt-1 text-sm" tooltip={this.state.saveBtnTooltipText}
                                    onClick={() => {
                                        this.setState({ saveBtnTooltipText: 'Copied!' });
                                        this.showSuccess();
                                    }} ></i>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
            )
        }
        else if (e.type === "Exchange") {
            return (
                <div>
                    <div>
                        <div className='flex'>
                            <div className='mr-1 mt-1 font-bold text-sm'>{e.type}</div>
                            <div className='pi pi-arrows-h mt-1'></div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    columnThree = (e) => {
        if (e.type === "Send") {
            return (
                <div>
                    <div className='flex'>
                        <div className='mr-1'>{e.amount.toFixed(4)}</div>
                        <div>{e.coin}</div>
                    </div>
                </div>
            )
        }
        else if (e.type === "Receive") {
            return (
                <div>
                    <div className='flex'>
                        <div className='mr-1'>{e.amount.toFixed(4)}</div>
                        <div>{e.coin}</div>
                    </div>
                </div>
            )
        }
        else if (e.type === "Exchange") {
            return (
                <div>
                    <div>
                        <div className='flex'>
                            <div className='mr-1'>+{e.amount1.toFixed(4)}</div>
                            <div>{e.coin1}</div>
                        </div>
                        <div className='flex'>
                            <div className='mr-1'>{e.amount2.toFixed(4)}</div>
                            <div>{e.coin2}</div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    columnFour = (e) => {
        if (e.type === "Send") {
            return (
                <div>
                    <div className='flex'>
                        <div className='mr-1'>Gas Fee: </div>
                        <div>{e.gas.toFixed(4)}</div>
                    </div>
                </div>
            )
        }
        else if (e.type === "Exchange") {
            return (
                <div>
                    <div className='flex'>
                        <div className='mr-1'>Gas Fee: </div>
                        <div>{e.gas.toFixed(4)}</div>
                    </div>
                </div>
            )
        }
    }



    render() {
        const data = this.state.data;

        const header = (
            <div className="table-header">

                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" value={this.state.globalFilter} onChange={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search by Tokenname, Date, Transaction Type..." />
                </span>
            </div>
        );

        return (
            <div>
                <Toast ref={(el) => (this.toast = el)} />

                <div className="mb-2">
                    <Button label="All Chains" onClick={() => this.setState({ globalFilter: '' })} className="p-button-text" />
                    <Button label="Arbitrum" onClick={() => this.setState({ globalFilter: 'arbitrum' })} className="p-button-text" />
                    <Button label="Avalanche" onClick={() => this.setState({ globalFilter: 'avalanche' })} className="p-button-text" />
                    <Button label="Binance" onClick={() => this.setState({ globalFilter: 'binance' })} className="p-button-text" />
                    <Button label="Ethereum" onClick={() => this.setState({ globalFilter: 'ethereum' })} className="p-button-text" />
                    <Button label="Polygon" onClick={() => this.setState({ globalFilter: 'polygon' })} className="p-button-text" />
                    <Button label="Fantom" onClick={() => this.setState({ globalFilter: 'fantom' })} className="p-button-text" />

                </div>


                <DataTable
                    value={data}
                    emptyMessage="No Transactions Found"
                    ref={(el) => this.dt = el}
                    header={header}
                    globalFilter={this.state.globalFilter}
                >
                    <Column field='date' body={this.columnOne} />
                    <Column className='text-right' field='type' body={this.columnTwo} />
                    <Column className='text-right' field='coin' body={this.columnThree} />
                    <Column className='text-right' field='network' body={this.columnFour} />
                </DataTable>
            </div>
        )
    }
}

export default Transaction