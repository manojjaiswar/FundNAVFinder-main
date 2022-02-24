import { InputText } from 'primereact/inputtext';
import React, { Component } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Constants } from '../utils/Constants';

export default class access extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      success: false,
      publicAddress: '',
      showError: '',
      userName: '',
    };
  }

  validateUser = () => {
    const email = this.state.email;
    const password = this.state.password;
    console.log(email, password);
    axios
      .post(`${Constants.BASE_URL}/verifyEmail`, {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res);
        this.setState({ showError: res.data.message });
        if (res.data.success === true) {
          this.setState({ success: true });
          const history = res.data.user.history;

          const name = res.data.user.guestUser.map((item, index, array) => {
            return array[index].email.indexOf(email);
          });

          console.log(name);
          const userIndex = name.indexOf(0);

          const userName = res.data.user.guestUser[userIndex].userName;
          this.setState({ userName: userName });
          console.log(userName);

          const table = [];
          history.map((item, index, array) => {
            const a = {
              date: array[index].date
                .substring(0, 10)
                .split('-')
                .reverse()
                .join('-'),
              time: array[index].date.substring(11, 19),
              nav: `$ ${array[index].nav}`,
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
          console.log(table);
          this.setState({
            table: table,
          });
        } else {
          this.setState({ success: false });
        }
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
        <small>{e.time} UTC</small>
      </div>
    );
  };

  render() {
    return (
      <>
        {!this.state.success && (
          <div className="lg:col-6 lg:col-offset-3 md:col-8 md:col-offset-2 sm:col-12">
            <h1>Header</h1>
            <Card>
              <div className="card">
                <div className="flex flex-column card-container">
                  <div className="flex align-items-center justify-content-center m-2">
                    <small id="username-help" className="p-error">
                      {this.state.showError}
                    </small>
                  </div>
                  <div className="flex align-items-center justify-content-center m-2">
                    <InputText
                      className="w-6"
                      placeholder="Your email id"
                      value={this.state.email}
                      onChange={(e) => {
                        this.setState({ email: e.target.value });
                      }}
                    />
                  </div>
                  {/* 
                  {this.state.showError && !this.state.email && (
                    <div className="flex align-items-center justify-content-center">
                      <small id="username-help" className="p-error ml-3">
                        Wrong Credentials
                      </small>
                    </div>
                  )} */}

                  <div className="flex align-items-center justify-content-center m-2">
                    <InputText
                      className="w-6"
                      placeholder="Access token"
                      value={this.state.password}
                      onChange={(e) => {
                        this.setState({ password: e.target.value });
                      }}
                    />
                  </div>
                  <div className="flex align-items-center justify-content-center m-2">
                    <Button
                      className="w-3"
                      label="Submit"
                      onClick={() => this.validateUser()}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {this.state.success && (
          <div className="lg:col-10 lg:col-offset-1 md:col-8 md:col-offset-2 sm:col-12">
            <div className="flex flex-row flex-wrap justify-content-between">
              <h1 className="flex inline">Overview</h1>
              <h1 className="flex inline">{this.state.userName}</h1>
            </div>

            <Card className="my-4 shadow-4">
              <DataTable
                value={this.state.table}
                expandedRows={this.state.expandedRows}
                onRowToggle={(e) => this.setState({ expandedRows: e.data })}
                responsiveLayout="scroll"
                rowExpansionTemplate={this.rowExpansionTemplate}
                dataKey="id"
              >
                <Column expander style={{ width: '3em' }} />
                <Column
                  field="date"
                  header="Date"
                  body={(e) => this.dateTemplate(e)}
                  sortable
                />
                <Column
                  field="nav"
                  className="text-right"
                  header="NAV"
                  sortable
                />
              </DataTable>
            </Card>
          </div>
        )}
      </>
    );
  }
}
