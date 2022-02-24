import React, { Component } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Web3Logo from '../assets/web3assetmanager_logo.png';
import { Constants } from '../utils/Constants';

class History extends Component {
  constructor() {
    super();
    this.state = {
      expandedRows: null,
      table: [],
      data: [],
      publicAddress: null,
      visible: false,
      id: null,
      loading: true
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

  componentDidMount = () => {
    this.getDetails();
  };

  componentDidUpdate = () => {
    this.getDetails();
  };

  getDetails = async () => {
    const table = [];
    const data = [];
    const publicAddress = window.localStorage.getItem('publicAddress')
    const details = await axios.get(`${Constants.BASE_URL}/getDetails/${publicAddress}`);
    const history = details.data.results.history;

    history.map((item, index, array) => {
      const date = new Date(array[index].date);
      const today = (date.toLocaleString())
      var initial = today.split(',')[0].split(/\//);
      const newDate = ([initial[1], initial[0], initial[2]].join('/'));
      const a = {
        date: newDate,
        time: today.split(',')[1],
        nav: `${array[index].nav}`,
        id: array[index]._id,
        selectedAddress: array[index].selectedAddress,
        selectedChain: array[index].selectedChain,
        data: array[index].data.map((item, index, array) => {
          const b = {
            token: array[index].token,
            balance: array[index].balance,
            price: array[index].price,
            value: array[index].value,
          };
          return b;
        }),
      };
      table.push(a);
    });

    this.setState({
      table: table,
      publicAddress: details.data.results.publicAddress,
      loading: false
    });
  };

  getDate = () => {
    let today = new Date();
    let day = `${today.getDate() < 10 ? '0' : ''}${today.getDate()}`;
    let month = `${today.getMonth() + 1 < 10 ? '0' : ''}${today.getMonth() + 1
      }`;
    let year = today.getFullYear();
    let dateToday = `${day}/${month}/${year}`;
    let currentTime = today.toLocaleTimeString();
    return dateToday;
  };

  downloadCSV = (value) => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(value.data);
      worksheet['!cols'] = [];
      worksheet['!cols'][4] = { hidden: true };
      worksheet['!cols'][5] = { hidden: true };
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'assets', value);
    });
  };

  saveAsExcelFile(buffer, fileName, value) {
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
      FileSaver.saveAs(data, value.date + '-Assets' + EXCEL_EXTENSION);
    });
  }

  downloadPDF = (value) => {
    const selectedChain = value.selectedChain;
    let selectedAddLen = value.selectedAddress.length;
    console.log(value.selectedAddress);
    const selectedAddress = value.selectedAddress.map((item, index, array) => {
      return array[index].code;
    });

    console.log(selectedAddress);

    let yAxis;
    if (selectedAddLen > 5) {
      yAxis = 50 + selectedAddLen * 2;
    } else {
      yAxis = 50;
    }
    console.log(value.data);
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
        doc.text(value.date, 178, 10);
        doc.text(value.time, 174, 14);
        doc.setFontSize(11);
        doc.text('Total NAV:', 15, 25);
        doc.setTextColor(30, 112, 0);
        doc.setFont(undefined, 'bold');
        doc.text(value.nav, 36, 25);
        doc.setTextColor(92, 92, 92);
        doc.setFont(undefined, 'normal');
        doc.text(
          'PrideVel Business Solutions LCC',
          75,
          doc.internal.pageSize.height - 10
        );

        doc.autoTable(this.exportColumns, value.data, {
          theme: 'grid',
          startY: yAxis,
          showHead: 'everyPage',
          // columnStyles: { 0: { halign: 'left' } },
          // headStyles: {
          //   halign: 'center',
          // },
          styles: {
            halign: 'right',
          },
        });
        doc.save(value.date + '-Assets.pdf');
      });
    });
    console.log(value.data);
  };

  actionBodyTemplate = (value) => {
    return (
      <div>
        <Button
          icon="pi pi-file"
          className="p-button-rounded p-button-success mr-1 p-button-outlined"
          onClick={() => this.downloadCSV(value)}
          tooltip="CSV"
          tooltipOptions={{
            className: 'indigo-tooltip',
            position: 'top',
          }}
        />
        <Button
          icon="pi pi-file-pdf"
          className="p-button-rounded p-button-info mr-1 p-button-outlined"
          onClick={() => this.downloadPDF(value)}
          tooltip="PDF"
          tooltipOptions={{
            className: 'indigo-tooltip',
            position: 'top',
          }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-outlined"
          onClick={() => {
            this.setState({ id: value.id });
            this.confirm2();
          }}
          tooltip="Delete"
          tooltipOptions={{
            className: 'indigo-tooltip',
            position: 'top',
          }}
        />
      </div>
    );
  };

  deleteColumn = (value) => {
    const id = value.id;
    const publicAddress = this.state.publicAddress;
    axios.post(`${Constants.BASE_URL}/deleteColumn`, {
      publicAddress: publicAddress,
      id: id,
    });
  };

  accept = () => {
    const id = this.state.id;
    const publicAddress = this.state.publicAddress;
    axios.post(`${Constants.BASE_URL}/deleteColumn`, {
      publicAddress: publicAddress,
      id: id,
    });
  };

  confirm2 = () => {
    confirmDialog({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: this.accept,
    });
  };

  rowExpansionTemplate(data) {
    return (
      <div>
        <DataTable value={data.data} responsiveLayout="scroll">
          <Column
            className="text-left"
            field="token"
            header="Token"
            sortable
          ></Column>
          <Column
            className="text-right"
            field="balance"
            header="Quantity"
            sortable
          ></Column>
          <Column
            className="text-right"
            field="price"
            header="Price"
            sortable
          ></Column>
          <Column
            className="text-right"
            field="value"
            header="Total Value"
            sortable
          ></Column>
        </DataTable>
      </div>
    );
  }

  dateTemplate = (e) => {
    return (
      <div>
        <strong>{e.date}</strong>
        <br />
        <small>{e.time}</small>
      </div>
    );
  };

  render() {
    return (
      <div className="lg:col-10 lg:col-offset-1 md:col-8 md:col-offset-2 sm:col-12">
        <div className="text-3xl text-bold mb-2 text-700">Records</div>
        <Card className="my-4 shadow-4">
          {!this.state.loading ?
            <div>
              <ConfirmDialog
                visible={this.state.visible}
                onHide={() => this.setState({ visible: false })}
                icon="pi pi-exclamation-triangle"
                accept={this.accept}
                reject={this.reject}
              />
              <DataTable
                value={this.state.table}
                expandedRows={this.state.expandedRows}
                onRowToggle={(e) => this.setState({ expandedRows: e.data })}
                responsiveLayout="scroll"
                rowExpansionTemplate={this.rowExpansionTemplate}
                dataKey="id"
                emptyMessage="No Records saved"
              >
                <Column expander style={{ width: '3em' }} />
                <Column
                  field="date"
                  header="Date"
                  body={(e) => this.dateTemplate(e)}
                  sortable
                />
                <Column field="nav" className="text-right" header="NAV" sortable />
                <Column
                  className="text-right"
                  body={this.actionBodyTemplate}
                  exportable={false}
                  style={{ minWidth: '8rem' }}
                />
              </DataTable>
            </div>
            : <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
          }
        </Card>
      </div>
    );
  }
}

export default History;
