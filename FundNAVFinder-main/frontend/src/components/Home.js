import React, { Component } from 'react';
import axios from 'axios';
import Moralis from 'moralis';
import { withRouter } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import img1 from '../assets/logos/coin1.png';
import Web3Logo from '../assets/web3assetmanager_logo.png';
import { Constants } from '../utils/Constants';
import { TabView, TabPanel } from 'primereact/tabview';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      nav: null,
      bal: [],
      val: [],
      cal: [],
      loading: true,
      fallback: img1,
      address: [],
      chain: [],
      pdfData: [],
      selectedChain: [],
      selectedAddress: [],
      selectedRow: null,
      cefi: [],
      nexoData: [],
      celsiusData: [],
      bncData: [],
      geminiData: [],
      wazirxData: [],
      totalNav: null,
      nexoNav: null,
      celsiusNav: null,
      bncNav: null,
      cefiNav: null,
      showCefi: false,
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
    Moralis.start({
      serverUrl: 'https://xiesgkgdkjyb.usemoralis.com:2053/server',
      appId: 'M4BhZMBnB8ykPCigvxnsqsf8kR6XZUPbJb05atIe',
    });
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    const chain = [
      { chain: 'Ethereum', id: '1', },
      { chain: 'Binance', id: '56', },
      { chain: 'Polygon', id: '137', },
      { chain: 'Avalanche', id: '43114', },
      { chain: 'Fantom', id: '250', },
      { chain: 'Arbitum', id: '42161', },
    ];
    const address = [];
    const selectedAddress = this.state.address.map((item, index, array) => { return array[index].walletAddress; });
    this.setState({ selectedAddress: selectedAddress });
    const publicAddress = window.localStorage.getItem('publicAddress')
    const b = await axios.get(`${Constants.BASE_URL}/getDetails/${publicAddress}`);
    console.log(b);
    b.data.results.address.map((value, index, array) => {
      const data = {
        label: array[index].adrName == null ? `${array[index].walletAddress.slice(0, 30)}...` : array[index].adrName,
        code: array[index].walletAddress,
      };
      address.push(data);
    });
    this.setState({ address: b.data.results.address });
    const table = [];
    const nav = [];
    const bal = [];
    const cal = [];
    const val = [];
    const pdf = [];
    const tab = []
    this.setState({ selectedAddress: address });
    for (let i = 0; i < address.length; i++) {
      val[address[i].label] = 0;
      for (let j = 0; j < chain.length; j++) {
        bal[chain[j].chain] = 0;
        const balance = await axios.get(`https://api.covalenthq.com/v1/${chain[j].id}/address/${address[i].code}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_ecf46a8674d649acb3cb172f4ad`);
        balance.data.data.items.map((item, index, array) => {
          if (index !== 0 && array[index].contract_name === array[index - 1].contract_name) { array.splice(index, 1); }
        });
        balance.data.data.items.map((item, index, array) => {
          const data = {
            logo: array[index].logo_url,
            token: array[index].contract_name,
            balance: `${(Number(array[index].balance) / Math.pow(10, array[index].contract_decimals)).toFixed(3)} ${array[index].contract_ticker_symbol}`,
            price: `${formatter.format(array[index].quote_rate)}`,
            value: `${formatter.format((Number(array[index].balance) / Math.pow(10, array[index].contract_decimals)) * array[index].quote_rate)}`,
            symbol: array[index].contract_ticker_symbol,
            chain: chain[j].chain,
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
                val[address[i].label] = val[address[i].label] + (Number(array[index].balance) / Math.pow(10, array[index].contract_decimals)) * array[index].quote_rate;
              }
            }
          }
        });
        console.log(balance)
        const a = `${chain[j].chain} ${i}`;
        cal[a] = bal[chain[j].chain];
        tab.push(table)
      }
    }
    console.log(tab);
    this.setState({ cal: cal });
    const a = [{ key: Object.keys(val), value: Object.values(val) }];
    console.log(a)
    const reducer = (previousValue, currentValue) => previousValue + currentValue;
    if (table.length !== 0) {
      let NAV = nav.reduce(reducer);
      console.log(NAV);
      NAV = formatter.format(NAV);
      this.setState({ data: table, nav: NAV, val: a, loading: false, pdfData: pdf });
      const calArr = [];
      for (const property in cal) {
        if (cal[property] !== 0) {
          calArr.push(property.split(' ')[0]);
        }
      }
      const uniq = [...new Set(calArr)];
      this.setState({ selectedChain: uniq });
    }
    this.setState({ val: a });

    // const nexoData = JSON.parse(window.localStorage.getItem('nexoData'));
    // const celsiusData = JSON.parse(window.localStorage.getItem('celsiusData'));
    // const bncData = JSON.parse(window.localStorage.getItem('bncData'));

    // const nexoNav = Number(window.localStorage.getItem('nexoNav'))
    // const celsiusNav = Number(window.localStorage.getItem('celsiusNav'))
    // const bncNav = Number(window.localStorage.getItem('bncNav'))
    // const NAV = nav.reduce(reducer)
    // const ttlNav = formatter.format(nexoNav + celsiusNav + bncNav + NAV);
    console.log(b.data.results.cefiHistory);


    const cefiData = b.data.results.cefiHistory;


    let nexoData, celsiusData, bncData, geminiData, wazirxData;
    let cefiNav;
    cefiData.map((item, index, array) => {
      if (array[index].cefi == 'nexo') {
        nexoData = array[index];
        cefiNav = cefiNav + nexoData.nav
        nexoData.date = nexoData.date.split('T')[0];
        this.setState({ nexoData })
      }
      if (array[index].cefi == 'celsius') {
        celsiusData = array[index];
        cefiNav = cefiNav + celsiusData.nav
        celsiusData.date = celsiusData.date.split('T')[0];
        this.setState({ celsiusData })
      }
      if (array[index].cefi == 'binance') {
        bncData = array[index];
        cefiNav = cefiNav + bncData.nav
        bncData.date = bncData.date.split('T')[0];
        this.setState({ bncData })
      }
      if (array[index].cefi == 'gemini') {
        geminiData = array[index];
        cefiNav = cefiNav + geminiData.nav
        geminiData.date = geminiData.date.split('T')[0];
        this.setState({ geminiData })

      }
      if (array[index].cefi == 'wazirx') {
        wazirxData = array[index];
        cefiNav = cefiNav + wazirxData.nav
        wazirxData.date = wazirxData.date.split('T')[0];
        this.setState({ wazirxData })
      }

    })

    console.log(this.state.nexoData);
    console.log(this.state.geminiData);

    // const cefi = [{ "nav": 0, "cefiWallet": [{ "Nexo": [], "Celsius": [], "Gemini": [], "Binance": [], "WazirX": [] }] },]

    // const cefi = [
    //   { "nexo": [], "celsius": [], "gemini": [], "binance": [], "wazirx": [] }
    // ]

    // console.log(cefi[0]);
    // console.log(cefi);
    // cefiData.map((item, index, array) => {
    //   if (array[index].cefi == 'nexo') {
    //     cefi[0].cefiWallet[0]["Nexo"] = (array[index].data)
    //     cefi[0].NAV = cefi[0].NAV + array[index].nav
    //   }
    //   if (array[index].cefi == 'celsius') {
    //     cefi[0].cefiWallet[0]["Celsius"] = (array[index].data)
    //     cefi[0].NAV = cefi[0].NAV + array[index].nav
    //   }
    //   if (array[index].cefi == 'binance') {
    //     cefi[0].cefiWallet[0]["Binance"] = (array[index].data)
    //     cefi[0].NAV = cefi[0].NAV + array[index].nav
    //   }
    //   if (array[index].cefi == 'gemini') {
    //     cefi[0].cefiWallet[0]["Gemini"] = (array[index].data)
    //     cefi[0].NAV = cefi[0].NAV + array[index].nav
    //   }
    //   if (array[index].cefi == 'wazirx') {
    //     cefi[0].cefiWallet[0]["WazirX"] = (array[index].data)
    //     cefi[0].NAV = cefi[0].NAV + array[index].nav
    //   }
    // })

    // console.log(cefi);
    // console.log(cefi[0].cefiWallet[0].Nexo);

    // this.setState({
    //   cefi: cefi
    // })

    // b.data.results.cefiHistory.map
    // console.log(nexoData.data);
    // console.log(celsiusData);
    // console.log(bncData);
    // console.log(geminiData);
    // console.log(wazirxData);

    // this.setState({
    //   nexoData: nexoData,
    //   celsiusData: celsiusData,
    //   bncData: bncData,
    //   geminiData: geminiData,
    //   wazirxData: wazirxData,
    //   cefiNav: cefiNav,
    //   showCefi: true,
    // })


  };

  fallbackAvatar = (e) => {
    e.target.src = this.state.fallback;
  };

  tokenTemplate = (e) => {
    return (
      <div className="flex inline">
        <img src={e.logo} onError={this.fallbackAvatar} className="border-circle h-2rem w-2.5 mr-2" />
        <div>{e.token}</div>
      </div>
    );
  };

  saveData = () => {
    const date = (`${this.getDate()} + ${this.getTime()}`)
    const dataTable = this.state.data;
    const nav = this.state.nav;
    const data = [];
    const selectedAddress = this.state.selectedAddress;
    const selectedChain = this.state.selectedChain;
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
      date: date
    }).then((res) => {
      if (res.data.success === true) { this.toast.show({ severity: 'success', summary: 'Record Saved', life: 3000, }); }
      else { this.toast.show({ severity: 'error', summary: 'Record was not saved', life: 3000, }); }
      console.log(res)
    })
  };

  products = Array.from({ length: 5 });

  bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  getDate = () => {
    let today = new Date();
    let day = `${today.getDate() < 10 ? '0' : ''}${today.getDate()}`;
    let month = `${today.getMonth() + 1 < 10 ? '0' : ''}${today.getMonth() + 1}`;
    let year = today.getFullYear();
    let dateToday = `${day}/${month}/${year}`;
    return dateToday;
  };

  getTime = () => {
    let today = new Date();
    let currentTime = today.toLocaleTimeString();
    return currentTime;
  };

  downloadPDF = () => {
    console.log(this.state.wazirxData);
    const selectedChain = this.state.selectedChain;
    let selectedAddLen = this.state.selectedAddress.length;
    const selectedAddress = this.state.selectedAddress.map((item, index, array) => { return array[index].code });
    let totalNav = this.state.nav;
    const pdfData = this.state.pdfData;
    console.log(pdfData);
    let yAxis;
    if (selectedAddLen > 5) {
      yAxis = 50 + selectedAddLen * 2;
    } else {
      yAxis = 50;
    }

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
        doc.text('Selected Addresses', 75, 25);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(selectedAddress, 75, 30);
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
        doc.text(totalNav, 36, 25);
        doc.setTextColor(92, 92, 92);
        doc.setFont(undefined, 'normal');
        doc.text('PrideVel Business Solutions LCC', 75, doc.internal.pageSize.height - 10);
        doc.autoTable(this.exportColumns, pdfData, {
          theme: 'grid', startY: yAxis, showHead: 'everyPage',
          // columnStyles: { 0: { halign: 'left' } },
          // headStyles: {
          //   halign: 'center',
          // },
          styles: { halign: 'right', },
        });
        doc.save(this.getDate() + '-Assets.pdf');
      });
    });
  };

  downloadCSV = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.state.data);
      worksheet.D1.v = 'Price';
      worksheet.F1.v = 'Value';
      worksheet['!cols'] = [];
      worksheet['!cols'][0] = { hidden: true };
      worksheet['!cols'][5] = { hidden: true };
      // worksheet['!cols'][7] = { hidden: true };
      // worksheet['!cols'][8] = { hidden: true };
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'assets');
    });
  };

  saveAsExcelFile(buffer, fileName) {
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

  onRowSelect = (event) => {
    // this.toast.current.show({ severity: 'info', summary: 'Token Selected', detail: `Name: ${event.data.token}`, life: 3000 });

    this.props.history.push(`/price/${event.data.chainId}/${event.data.contractAddress}`)
  }


  render() {
    const data = this.state.data;
    const value = this.state.val;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const cefi = this.state.cefi;

    const { nexoData, geminiData, celsiusData, bncData, wazirxData } = this.state;



    return (
      <div className="lg:col-10 lg:col-offset-1 md:col-8 md:col-offset-2 sm:col-12 sm:col-offset-0">
        <Toast ref={(el) => (this.toast = el)} />
        <div className="text-3xl text-bold mb-2 text-700">Dashboard</div>
        {this.state.loading && (
          <Card className=' bg-indigo-50 text-indigo-900'>
            <DataTable value={this.products} className="p-datatable-striped">
              <Column field="code" header="Token" style={{ width: '25%' }} body={this.bodyTemplate}></Column>
              <Column field="name" header="Quantity" style={{ width: '25%' }} body={this.bodyTemplate}></Column>
              <Column field="category" header="Price" style={{ width: '25%' }} body={this.bodyTemplate}></Column>
              <Column field="quantity" header="Value" style={{ width: '25%' }} body={this.bodyTemplate}></Column>
            </DataTable>
          </Card>
        )}
        {!this.state.loading && (
          <div>
            {this.state.data.length == 0 && (
              <div className='bg-indigo-50 text-indigo-900 border-round p-4 my-3'>
                <div className="col-4 col-offset-4 text-center">
                  <h1>No Assets Yet</h1>
                </div>
              </div>
            )}
            {this.state.data.length != 0 && (
              <div>

                <div className="flex flex-wrap-reverse md:flex-wrap my-3" >
                  {value[0].key.map((v, i, a) => {
                    return (
                      <div title={this.state.address[i].walletAddress} onClick={() => this.props.history.push(`/wallet/${this.state.address[i].walletAddress}`)} class="col-12 lg:w-auto transition-colors transition-duration-500 bg-indigo-50 text-indigo-900 hover:bg-indigo-200 text-600 hover:text-gray-900 align-items-center border-round cursor-pointer m-1 px-3 py-3 shadow-2">
                        <div class="font-bold my-1 overflow-hidden text-overflow-ellipsis" style={{ "width": "173px" }}>
                          {a[i]}
                        </div>
                        <div className="font-semibold">
                          {formatter.format(value[0].value[i])}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Card className="bg-indigo-50 ">
                  <div className='text-7xl font-bold mb-2 text-600'>{this.state.totalNav}</div>
                </Card>
                <br />
                <div className="bg-indigo-50 text-indigo-900 border-round p-4 mb-5">
                  <div className="text-7xl font-bold mb-2 text-700 flex">
                    {this.state.nav.split('.')[0]}.<div className='text-7xl text-bold mb-2 text-500'>{this.state.nav.split('.')[1]}</div>
                  </div>
                  <div className="flex justify-content-between mb-2">
                    <Button icon="pi pi-save" className="mr-1 p-button-raised" label="Save as Record" onClick={this.saveData} />
                    <div>
                      <Button icon="pi pi-file-excel" className="p-button-raised mx-1" onClick={this.downloadCSV} tooltip="CSV"
                        tooltipOptions={{ className: 'indigo-tooltip', position: 'top' }}
                      />
                      <Button icon="pi pi-file-pdf" className="p-button-raised ml-1" onClick={this.downloadPDF} tooltip="PDF"
                        tooltipOptions={{ className: 'indigo-tooltip', position: 'top' }}
                      />
                    </div>
                  </div>
                  <DataTable selectionMode="single"
                    value={data}
                    className="p-datatable-lg"
                    scrollable
                    scrollHeight="300px"
                    selection={this.state.selectedRow}
                    onSelectionChange={e => this.setState({ selectedRow: e.value })}
                    onRowSelect={this.onRowSelect}
                  >
                    <Column className="text-left" field="token" header="Tokens" body={this.tokenTemplate} />
                    <Column className="text-right" field="balance" header="Quantity" />
                    <Column className="text-right" field="price" header={'Price'} />
                    <Column className="text-right" field="value" header={'Total Value'} />
                  </DataTable>
                </div>

              </div>
            )}


            {/* {this.state.cefi.length !== 0 ?
              <div>

                {Object.keys(this.state.cefi[0]).map(function (key, index, array) {
                  return (
                    <div>
                      {this.state.cefi[0][key]}
                    </div>)
                })}
              </div> : <div>hello</div>} */}

            {nexoData.length !== 0 &&
              <Card className='my-4'>
                <div className="text-5xl mb-2">Nexo</div>
                <div className="text-4xl font-bold mb-2 text-600">{formatter.format(nexoData.nav)}</div>
                <div className="text-right font-bold mb-1 text-600">Last Upload Date: {nexoData.date}</div>
                <DataTable selectionMode="single"
                  value={nexoData.data}
                  className="p-datatable-lg"

                >
                  <Column className="text-left" field="token" header="Tokens" body={this.tokenTemplate} />
                  <Column className="text-right" field="balance" header="Quantity" />
                  <Column className="text-right" field="price" header={'Price'} />
                  <Column className="text-right" field="value" header={'Total Value'} />
                </DataTable>
              </Card>
            }

            {celsiusData.length !== 0 && <Card className='my-4'>
              <div className="text-5xl mb-2">Celsius</div>
              <div className="text-4xl font-bold mb-2 text-600">{formatter.format(celsiusData.nav)}</div>
              <div className="text-right font-bold mb-1 text-600">Last Upload Date: {celsiusData.date}</div>
              <DataTable selectionMode="single"
                value={celsiusData.data}
                className="p-datatable-lg"

              >
                <Column className="text-left" field="token" header="Tokens" body={this.tokenTemplate} />
                <Column className="text-right" field="balance" header="Quantity" />
                <Column className="text-right" field="price" header={'Price'} />
                <Column className="text-right" field="value" header={'Total Value'} />
              </DataTable>
            </Card>}

            {bncData.length !== 0 && <Card className='my-4'>
              <div className="text-5xl mb-2">Binance</div>
              <div className="text-4xl font-bold mb-2 text-600">{formatter.format(bncData.nav)}</div>
              <div className="text-right font-bold mb-1 text-600">Last Upload Date: {bncData.date}</div>
              <DataTable selectionMode="single"
                value={bncData.data}
                className="p-datatable-lg"

              >
                <Column className="text-left" field="token" header="Tokens" body={this.tokenTemplate} />
                <Column className="text-right" field="balance" header="Quantity" />
                <Column className="text-right" field="price" header={'Price'} />
                <Column className="text-right" field="value" header={'Total Value'} />
              </DataTable>
            </Card>}

            {geminiData.length !== 0 && <Card className='my-4'>
              <div className="text-5xl mb-2">Gemini</div>
              <div className="text-4xl font-bold mb-2 text-600">{formatter.format(geminiData.nav)}</div>
              <div className="text-right font-bold mb-1 text-600">Last Upload Date: {geminiData.date}</div>
              <DataTable selectionMode="single"
                value={geminiData.data}
                className="p-datatable-lg"

              >
                <Column className="text-left" field="token" header="Tokens" body={this.tokenTemplate} />
                <Column className="text-right" field="balance" header="Quantity" />
                <Column className="text-right" field="price" header={'Price'} />
                <Column className="text-right" field="value" header={'Total Value'} />
              </DataTable>
            </Card>}

            {wazirxData.length !== 0 && <Card className='my-4'>
              <div className="text-5xl mb-2">WazirX</div>
              <div className="text-4xl font-bold mb-2 text-600">{formatter.format(wazirxData.nav)}</div>
              <div className="text-right font-bold mb-1 text-600">Last Upload Date: {wazirxData.date}</div>
              <DataTable selectionMode="single"
                value={wazirxData.data}
                className="p-datatable-lg"

              >
                <Column className="text-left" field="token" header="Tokens" body={this.tokenTemplate} />
                <Column className="text-right" field="balance" header="Quantity" />
                <Column className="text-right" field="price" header={'Price'} />
                <Column className="text-right" field="value" header={'Total Value'} />
              </DataTable>
            </Card>}




            <div className="card bg-white p-3">
              <div className="flex justify-content-between">
                <div className="text-3xl text-bold mb-2 text-700 flex">Cefi</div>
                <div className="text-3xl text-bold mb-2 text-700 flex">{formatter.format(this.state.cefiNav)}</div>
              </div>


            </div>





          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Home);