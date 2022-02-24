import React, { Component } from 'react';
import axios from 'axios';
import makeBlockie from 'ethereum-blockies-base64';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { TabPanel, TabView } from 'primereact/tabview'
import Web3Logo from '../assets/web3assetmanager_logo.png';
import ethereum_logo from '../assets/logos/ethereum_logo.png';
import binance_logo from '../assets/logos/binance_logo.png';
import polygon_logo from '../assets/logos/polygon_logo.png';
import avalanche_logo from '../assets/logos/avalanche_logo.png';
import fantom_logo from '../assets/logos/fantom_logo.png';
import arbitrum_logo from '../assets/logos/arbitrum_logo.png';
import img1 from '../assets/logos/coin1.png';
import { Constants } from '../utils/Constants';
import DoughNut from './DoughNut';
import Transaction from './Transaction';
import Ethereum from './Chain/Ethereum';
import Polygon from './Chain/Polygon';
import Avalanche from './Chain/Avalanche';
import Binance from './Chain/Binance';
import Fantom from './Chain/Fantom';
import Arbitrum from './Chain/Arbitrum';

export default class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      address: props.match.params.walletAddress,
      val: [],
      loading: true,
      nav: '',
      pdfData: [],
      fallback: img1,
      selectedRow: null,
    };

    this.cols = [
      { field: 'token', header: 'Token' },
      { field: 'balance', header: 'Quantity' },
      { field: 'price', header: 'Price' },
      { field: 'value', header: 'Total Value' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  componentDidMount = async () => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    const chain = [
      {chain: 'Ethereum',id: '1',logo: ethereum_logo,},
      {chain: 'Binance',id: '56',logo: binance_logo,},
      {chain: 'Polygon',id: '137',logo: polygon_logo,},
      {chain: 'Avalanche',id: '43114',logo: avalanche_logo,},
      {chain: 'Fantom',id: '250',logo: fantom_logo,},
      {chain: 'Arbitrum',id: '42161',logo: arbitrum_logo,},
    ];
    const address = this.state.address;
    console.log(address);
    const table = [];
    const nav = [];
    const bal = [];
    const val = [];
    const cal = [];
    const pdf = [];
    for (let j = 0; j < chain.length; j++) {
      bal[chain[j].chain] = 0;
      const balance = await axios.get(`https://api.covalenthq.com/v1/${chain[j].id}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_ecf46a8674d649acb3cb172f4ad`);
      balance.data.data.items.map((item, index, array) => {
        if (index !== 0 && array[index].contract_name === array[index - 1].contract_name) {
          array.splice(index, 1);
        }
      });
      balance.data.data.items.map((item, index, array) => {
        const data = {
          logo: array[index].logo_url,
          token: array[index].contract_name,
          balance: `${(Number(array[index].balance) / Math.pow(10, array[index].contract_decimals)).toFixed(3)} ${array[index].contract_ticker_symbol}`,
          price: `${formatter.format(array[index].quote_rate)}`,
          value: `${formatter.format((Number(array[index].balance) / Math.pow(10, array[index].contract_decimals)) * array[index].quote_rate)}`,
          symbol: array[index].contract_ticker_symbol,
          contractAddress: array[index].contract_address,
          chainId: chain[j].id
        };

        const pdfData = {
          token: data.token,
          balance: data.balance,
          price: data.price,
          value: data.value,
        };

        if (data.value !== '$0.00') {
          if (
            data.token !== null &&
            data.token !== 'Wrapped sKLIMA' &&
            data.token !== 'Mina Protocol' &&
            data.token !== 'YFIN' &&
            data.token !== '$Hello' &&
            data.token !== 'Muon' &&
            data.token !== 'Minereum Polygon'
          ) {
            if (!data.token.includes('.')) {
              table.push(data);
              pdf.push(pdfData);
              nav.push((Number(array[index].balance) / Math.pow(10, array[index].contract_decimals)) * array[index].quote_rate);
              bal[chain[j].chain] = bal[chain[j].chain] + (Number(array[index].balance) / Math.pow(10, array[index].contract_decimals)) * array[index].quote_rate;
            }
          }
        }
      });
    }
    const a = [{ key: Object.keys(bal), value: Object.values(bal) }];
    const reducer = (previousValue, currentValue) =>
      previousValue + currentValue;
    const b = [];
    a[0].key.map((item, index, array) => {
      if (a[0].value[index] !== 0) {
        const data = {
          network: array[index],
          nav: a[0].value[index],
          logo: chain[index].logo,
        };
        b.push(data);
      }
    });
    console.log(b);
    if (b.length !== 0) {
      let NAV = nav.reduce(reducer);
      this.setState({ data: table, nav: NAV, val: b, pdfData: pdf });
    }
    this.setState({ loading: false });
  };

  saveData = () => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    this.toast.show({
      severity: 'success',
      summary: 'Record Saved',
      life: 3000,
    });
    const dataTable = this.state.data;
    const nav = formatter.format(this.state.nav);
    const data = [];
    const selectedAddress = this.state.selectedAddress;
    const selectedChain = this.state.chain;
    const publicAddress = window.localStorage.getItem('publicAddress');
    dataTable.map((value, index, array) => {
      const d = {
        token: array[index].symbol,
        balance: array[index].balance,
        price: array[index].price,
        value: array[index].value,
        block: array[index].block,
      };
      data.push(d);
    });
    axios.post(`${Constants.BASE_URL}/saveData`, {
      publicAddress: publicAddress,
      data: data,
      nav: nav,
      selectedAddress: selectedAddress,
      selectedChain: selectedChain,
    });
  };

  getDate = () => {
    let today = new Date();
    let day = `${today.getDate() < 10 ? '0' : ''}${today.getDate()}`;
    let month = `${today.getMonth() + 1 < 10 ? '0' : ''}${today.getMonth() + 1
      }`;
    let year = today.getFullYear();
    let dateToday = `${day}/${month}/${year}`;
    return dateToday;
  };

  getTime = () => {
    let today = new Date();
    let currentTime = today.toLocaleTimeString();
    return currentTime;
  };

  downloadCSV = () => {
    console.log(this.state.nav);

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.state.data);
      worksheet['!cols'] = [];
      worksheet['!cols'][0] = { hidden: true };
      worksheet['!cols'][5] = { hidden: true };
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'assets');
    });
  };

  saveAsExcelFile(buffer) {
    let today = new Date();
    let day = `${today.getDate() < 10 ? '0' : ''}${today.getDate()}`;
    let month = `${today.getMonth() + 1 < 10 ? '0' : ''}${today.getMonth() + 1
      }`;
    let year = today.getFullYear();
    let dateToday = `${day}/${month}/${year}`;
    console.log(dateToday);

    import('file-saver').then((FileSaver) => {
      let EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(data, this.getDate() + '-Assets' + EXCEL_EXTENSION);
    });
  }

  downloadPDF = () => {
    const selectedChain = this.state.val.map((item, index, array) => {
      return array[index].network;
    });
    console.log(selectedChain);
    const address = this.state.address;
    let AddLen = address.length;
    console.log(this.state.val);

    let nav = `$${(Math.round(this.state.nav * 100) / 100).toFixed(2)}`;
    let navNum;
    const navAlign = () => {
      return navNum = 193 - nav.toString().length
    }

    const pdfData = this.state.pdfData;

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.page = 1;
        var img = new Image();
        img.src = Web3Logo;
        doc.addImage(img, 'png', 15, 3, 40, 12);
        doc.setFontSize(11);
        doc.setTextColor(92, 92, 92);
        doc.setFont(undefined, 'bold');
        doc.text('Wallet Address', 75, 25);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(address, 75, 30);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.text('Selected Chains', 165, 25);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text(selectedChain, 165, 30);
        doc.setFont(undefined, 'bold');
        doc.text(this.getDate(), 177, 10);
        doc.text(this.getTime(), 176, 14);
        doc.setFontSize(11);
        doc.text('Total NAV:', 15, 25);
        doc.setTextColor(30, 112, 0);
        doc.setFont(undefined, 'bold');
        doc.text(nav, 36, 25);
        doc.setTextColor(92, 92, 92);
        doc.setFont(undefined, 'normal');
        doc.text(
          'PrideVel Business Solutions LCC',
          75,
          doc.internal.pageSize.height - 10
        );

        doc.autoTable(this.exportColumns, pdfData, {
          theme: 'grid',
          startY: 55,
          showHead: 'everyPage',
          // columnStyles: { 0: { halign: 'left' } },
          // headStyles: {
          //   halign: 'center',
          // },
          styles: {
            halign: 'right',
          },
        });
        doc.save(this.getDate() + '-Assets.pdf');
      });
    });
  };

  products = Array.from({ length: 5 });

  bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  tokenTemplate = (e) => {
    return (
      <div className="flex inline">
        <img
          src={e.logo}
          onError={this.fallbackAvatar}
          className="border-circle h-2rem w-2.5 mr-2"
        />

        <div>{e.token}</div>
      </div>
    );
  };

  fallbackAvatar = (e) => {
    e.target.src = this.state.fallback;
  };

  showSuccess() {
    this.toast.show({
      severity: 'success',
      summary: 'Copied!',
      detail: '',
      life: 1500,
    });
  }

  onRowSelect = (event) => {
    // this.toast.current.show({ severity: 'info', summary: 'Token Selected', detail: `Name: ${event.data.token}`, life: 3000 });
    console.log(event.data)
    this.props.history.push(`/price/${event.data.chainId}/${event.data.contractAddress}`)
  }

  render() {
    const data = this.state.data;
    const val = this.state.val;

    const doughnutChainData = [];
    const doughnutNavData = []
    val.map((item, index, array) => {
      doughnutChainData.push(array[index].network)
      doughnutNavData.push(array[index].nav)
    })
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });


    return (
      <div className="lg:col-10 lg:col-offset-1 md:col-8 md:col-offset-2 sm:col-12 sm:col-offset-0">
        <Toast ref={(el) => (this.toast = el)} />
        <Toast ref={this.toast} />
        {this.state.loading && (
          <>
            <div className=" bg-indigo-50 text-indigo-900 border-round p-4 my-3">
              <div className="flex my-4">
                <Skeleton shape="circle" size="2rem" className="mr-2" ></Skeleton>
                <Skeleton width="20rem" className="mb-2"></Skeleton>
              </div>
              <DataTable value={this.products} className="p-datatable-striped">
                <Column field="code" header="Token" style={{ width: '25%' }} body={this.bodyTemplate} />
                <Column field="name" header="Quantity" style={{ width: '25%' }} body={this.bodyTemplate} />
                <Column field="category" header="Price" style={{ width: '25%' }} body={this.bodyTemplate} />
                <Column field="quantity" header="Value" style={{ width: '25%' }} body={this.bodyTemplate} />
              </DataTable>
            </div>
          </>
        )}
        {!this.state.loading && (
          <>
            {this.state.data.length == 0 && (
              <div className=" bg-indigo-50 text-indigo-900 border-round p-4 my-3">
                <div className="flex">
                  <img src={makeBlockie(this.state.address)} style={{ height: '30px', width: '30px', borderRadius: '50%' }} />
                  <div className="mx-2 text-xl text-600"> {this.state.address} </div>
                  <CopyToClipboard text={this.state.address} onCopy={() => this.setState({ copied: true })} >
                    <i style={{ cursor: 'pointer' }} className="pi pi-copy ml-1 mt-1 text-sm" tooltip={this.state.saveBtnTooltipText}
                      onClick={() => {
                        this.setState({ saveBtnTooltipText: 'Copied!' });
                        this.showSuccess();
                      }}></i>
                  </CopyToClipboard>
                </div>
                <div className="col-4 col-offset-4 text-center">
                  <h1>No Assets Yet</h1>
                </div>
              </div>
            )}
            {this.state.data.length != 0 && (
              <>
                <div className=" bg-indigo-50 text-indigo-900 border-round p-4 my-3">
                  <div className="flex justify-content-between">
                    <div className="flex">
                      <img src={makeBlockie(this.state.address)} style={{ height: '30px', width: '30px', borderRadius: '50%' }} />
                      <div className="mx-2 text-xl text-600"> {this.state.address} </div>
                      <CopyToClipboard text={this.state.address} onCopy={() => this.setState({ copied: true })} >
                        <i style={{ cursor: 'pointer' }} className="pi pi-copy ml-1 mt-1 text-sm" tooltip={this.state.saveBtnTooltipText}
                          onClick={() => {
                            this.setState({ saveBtnTooltipText: 'Copied!' });
                            this.showSuccess();
                          }} ></i>
                      </CopyToClipboard>
                    </div>
                    <div className="mx-2 text-xl font-bold text-600"> {formatter.format(this.state.nav)} </div>
                  </div>
                  <div className="grid my-3">
                    {val.map((item, index, array) => {
                      return (
                        <div className="flex m-2">
                          <img className="mt-2" src={array[index].logo} style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
                          <div className="text-sm m-2">
                            <div className="text-xs"> Assets on {array[index].network} </div>
                            <div className="text-bold">
                              {formatter.format(array[index].nav)}{' '}
                              <label className="ml-2 text-sm text-600">{' '} {Math.round((Number(array[index].nav) / Number(this.state.nav)) * 100)} % </label>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                    <div>
                    </div>
                    <DoughNut chainData={doughnutChainData} navData={doughnutNavData} />
                  </div>
                </div>
                <TabView>
                  <TabPanel header='Portfolio'>
                    <div className=" bg-indigo-50 text-indigo-900 border-round p-4">
                      <div className="flex justify-content-between mb-2">
                        <Button icon="pi pi-save" className="mr-1 p-button-raised" label="Save as Record" onClick={this.saveData} />
                        <div>
                          <Button icon="pi pi-file-excel" className="p-button-raised mx-1" onClick={this.downloadCSV} tooltip="CSV"
                            tooltipOptions={{ className: 'indigo-tooltip', position: 'top' }} />
                          <Button icon="pi pi-file-pdf" className="p-button-raised ml-1" onClick={this.downloadPDF} tooltip="PDF"
                            tooltipOptions={{ className: 'indigo-tooltip', position: 'top' }} />
                        </div>
                      </div>
                      <DataTable
                        selection={this.state.selectedRow} onSelectionChange={e => this.setState({ selectedRow: e.value })}
                        onRowSelect={this.onRowSelect} selectionMode="single" value={data} className="p-datatable-lg"
                        scrollable scrollHeight="300px" >
                        <Column className="text-left" field="token" header="Tokens" body={this.tokenTemplate} sortable />
                        <Column className="text-right" field="balance" header="Quantity" sortable />
                        <Column className="text-right" field="price" header={'Price'} sortable />
                        <Column className="text-right" field="value" header={'Total Value'} sortable />
                      </DataTable>
                    </div>
                  </TabPanel>
                  <TabPanel header="History">
                    <Transaction walletAddress={this.state.address} />
                  </TabPanel>
                </TabView>
                <Ethereum walletAddress={this.state.address}/>
                <Polygon walletAddress={this.state.address}/>
                <Avalanche walletAddress={this.state.address}/>
                <Binance walletAddress={this.state.address}/>
                <Fantom walletAddress={this.state.address}/>
                <Arbitrum walletAddress={this.state.address}/>
              </>
            )}
          </>
        )
        }
      </div>
    );
  }
}
