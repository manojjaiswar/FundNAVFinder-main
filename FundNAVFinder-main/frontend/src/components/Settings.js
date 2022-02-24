import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import Moralis from 'moralis';
import { Constants } from '../utils/Constants';
import { ProgressBar } from 'primereact/progressbar';


Moralis.start({
  serverUrl: 'https://kz6gugt8lfij.usemoralis.com:2053/server',
  appId: 'MEoK7FwOuiRN4pTMQbSBOrDfvD29XvGqfu8avXDA',
});

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      visibleLeft: false,
      wallet: null,
      adrName: '',
      selectedAddress: null,
      publicAddress: [],
      addr: [],
      listItems: [],
      displayBasic: false,
      visible: false,
      walletAddress: null,
      addrName: null,
      add: [],
      showError: false,
      defaultAdrName: '',
      saveBtnTooltipText: 'Copy to Clipboard',
      copied: false,
      existError: '',
      loading: true,
    };
    this.pattern = /^0x[a-fA-F0-9]{40}$/;
  }

  componentDidMount = async () => {
    //this.toastBL.show({severity:'success', summary: 'YAY! ', detail:'You made it', life: 3000});
    const publicAddress = window.localStorage.getItem('publicAddress');
    console.log(publicAddress);
    this.setState({ publicAddress: publicAddress });
    const addr = await axios.get(
      `${Constants.BASE_URL}/getDetails/${publicAddress}`
    );
    this.setState({ defaultAdrName: addr.data.results.address[0].adrName });
    addr.data.results.address.shift();
    const addr3 = addr.data.results.address;
    this.setState({ addr: addr3, loading: false });
    console.log(addr);
  };

  componentDidUpdate = async () => {
    const publicAddress = window.localStorage.getItem('publicAddress');
    const addr = await axios.get(
      `${Constants.BASE_URL}/getDetails/${publicAddress}`
    );
    this.setState({
      addr: addr.data.results.address,
      defaultAdrName: addr.data.results.address[0].adrName,
    });
  };

  handleLogout = () => {
    window.sessionStorage.removeItem('access-token');
    window.location = '/';
    this.setState({ userlogin: false });
  };

  addAddress = async () => {
    if (this.state.wallet == null) {
      this.setState({ showError: true });
    } else if (this.state.wallet.match(this.pattern)) {
      const add = this.state.wallet.toString();
      let adrNm = this.state.adrName;
      const address = add.toLowerCase();
      if (adrNm.replace(/\s/g, "") == "") {
        adrNm = null
      }
      axios
        .post(`${Constants.BASE_URL}/addWallet`, {
          publicAddress: this.state.publicAddress,
          walletAddress: address,
          adrName: adrNm,
        })
        .then((res) => {
          console.log(res);
          this.setState({ existError: res.data.message });
        });

      this.setState({ wallet: '', adrName: '' });
      this.setState({ showError: false });
    } else {
      this.setState({ showError: true });
    }
  };

  confirmPosition(position) {
    confirmDialog({
      message: 'Do you want to delete this address?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      position,
      accept: this.accept,
    });
  }

  accept = () => {
    const walletAddress = this.state.walletAddress;
    const addrName = this.state.addrName;

    axios
      .post(`${Constants.BASE_URL}/delAddress`, {
        walletAddress: walletAddress,
        publicAddress: this.state.publicAddress,
        adrName: addrName,
      })
      .then((res) => console.log(res));
  };

  reject() {
    console.log('rejected');
  }

  editAddress = async () => {
    const wallet = this.state.wallet;
    let adr = this.state.adrName;
    if (adr.replace(/\s/g, "") == "") {
      adr = null
    }
    axios.post(`${Constants.BASE_URL}/editAddress`, {
      walletAddress: wallet,
      adrName: adr,
      publicAddress: this.state.publicAddress,
    });
    this.setState({ wallet: '' });
    this.setState({ adrName: '' });
  };

  onClick = (name, position, address) => {
    let state = {
      [`${name}`]: true,
    };

    if (position) {
      state = {
        ...state,
        position,
      };
    }

    this.setState(state);
    this.setState({ wallet: address });
  };

  onHide = (name) => {
    this.setState({
      [`${name}`]: false,
    });
    this.setState({ wallet: '' });
  };

  renderFooter = (name) => {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => this.onHide(name)}
          className="p-button-text"
        />
        <Button
          label="Confirm"
          icon="pi pi-check"
          onClick={() => {
            this.editAddress();
            this.onHide(name);
          }}
          autoFocus
        />
      </div>
    );
  };

  showSuccess() {
    this.toast.show({
      severity: 'success',
      summary: 'Copied!',
      detail: '',
      life: 1500,
    });
  }

  render() {
    const publicAddress = window.localStorage.getItem('publicAddress');
    return (
      <div>
        <div className="lg:col-10 lg:col-offset-1 md-8 md:col-offset-2 sm-12 sm:col-offset-0 mb-4">
          <Toast ref={(el) => (this.toast = el)} />
          <div className="text-3xl text-bold mb-2 text-700">Address Box</div>
          <Dialog
            header="Header"
            visible={this.state.displayBasic}
            footer={this.renderFooter('displayBasic')}
            onHide={() => this.onHide('displayBasic')}
          >
            <InputText
              type="text"
              value={this.state.adrName}
              onChange={(e) => this.setState({ adrName: e.target.value })}
              className="p-inputtext-sm col-12 mb-2"
              placeholder="Enter Wallet Name"
            />
          </Dialog>
          <Card className="shadow-4">
            {!this.state.loading ?
              <div>
                <div className="grid mb-4 mx-2 mt-2">
                  <img
                    src={makeBlockie(publicAddress)}
                    style={{ height: '36px', width: '36px', borderRadius: '50%' }}
                  />
                  <div className="col p-0 ml-2">
                    <strong>
                      {this.state.defaultAdrName == null
                        ? (<div>
                          {this.state.publicAddress}
                          <CopyToClipboard
                            text={this.state.publicAddress}
                            onCopy={() => this.setState({ copied: true })}
                          >
                            <i
                              style={{ cursor: 'pointer' }}
                              className="pi pi-copy ml-1 mt-1 text-sm inline"
                              tooltip={this.state.saveBtnTooltipText}
                              onClick={() => {
                                this.setState({ saveBtnTooltipText: 'Copied!' });
                                this.showSuccess();
                              }}
                            ></i>
                          </CopyToClipboard>
                        </div>)
                        : this.state.defaultAdrName}
                    </strong>

                    <br />
                    <small className="text-700">
                      {this.state.defaultAdrName !== null ? (
                        (<div>
                          {this.state.publicAddress}
                          <CopyToClipboard
                            text={this.state.publicAddress}
                            onCopy={() => this.setState({ copied: true })}
                          >
                            <i
                              style={{ cursor: 'pointer' }}
                              className="pi pi-copy ml-1 mt-1 text-sm inline"
                              tooltip={this.state.saveBtnTooltipText}
                              onClick={() => {
                                this.setState({ saveBtnTooltipText: 'Copied!' });
                                this.showSuccess();
                              }}
                            ></i>
                          </CopyToClipboard>
                        </div>)
                      ) : (
                        <label className="text-100">-</label>
                      )}
                    </small>


                  </div>

                  <div>
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-outlined p-button-success mr-0 tbtnsm"
                      onClick={() =>
                        this.onClick(
                          'displayBasic',
                          'center',
                          this.state.publicAddress
                        )
                      }
                    />
                  </div>
                </div>
                <div className="formgroup-inline flex mb-3 justify-content-between mx-2">
                  <div className="flex justify-content-start">
                    <div className="field">
                      <InputText
                        type="text"
                        value={this.state.wallet}
                        onChange={(e) => this.setState({ wallet: e.target.value })}
                        className="p-inputtext-sm block mb-2"
                        placeholder="Enter Wallet Address"
                        pattern="/^0x[a-fA-F0-9]{40}$/"
                        autoFocus
                      />
                      <small id="username-help" className="p-error">
                        {this.state.existError}
                      </small>
                      {this.state.showError && (
                        <small id="username-help" className="p-error">
                          Enter a valid Wallet Address
                        </small>
                      )}
                    </div>

                    <div className="field">
                      <InputText
                        type="text"
                        value={this.state.adrName}
                        onChange={(e) => this.setState({ adrName: e.target.value })}
                        className="p-inputtext-sm block mb-2"
                        placeholder="Enter Wallet Name"
                      />
                    </div>
                  </div>

                  <div className="">
                    <Button label="Add" onClick={this.addAddress} />
                  </div>
                </div>

                <div>
                  {this.state.addr.map((item, index, array) => {
                    if (index !== 0) {
                      return (
                        <div className="grid mb-4 mx-2">
                          <img
                            className="m-1"
                            src={makeBlockie(array[index].walletAddress)}
                            style={{
                              height: '40px',
                              width: '40px',
                              borderRadius: '50%',
                            }}
                          />
                          <div className="col">
                            <strong>
                              {array[index].adrName == null
                                ? (<div>
                                  {array[index].walletAddress}
                                  <CopyToClipboard
                                    text={array[index].walletAddress}
                                    onCopy={() => this.setState({ copied: true })}
                                  >
                                    <i
                                      style={{ cursor: 'pointer' }}
                                      className="pi pi-copy ml-1 mt-1 text-sm inline"
                                      tooltip={this.state.saveBtnTooltipText}
                                      onClick={() => {
                                        this.setState({ saveBtnTooltipText: 'Copied!' });
                                        this.showSuccess();
                                      }}
                                    ></i>
                                  </CopyToClipboard>
                                </div>)
                                : array[index].adrName}
                            </strong>

                            <br />
                            <small className="text-700">
                              {array[index].adrName !== null ? (
                                (<div>
                                  {array[index].walletAddress}
                                  <CopyToClipboard
                                    text={array[index].walletAddress}
                                    onCopy={() => this.setState({ copied: true })}
                                  >
                                    <i
                                      style={{ cursor: 'pointer' }}
                                      className="pi pi-copy ml-1 mt-1 text-sm inline"
                                      tooltip={this.state.saveBtnTooltipText}
                                      onClick={() => {
                                        this.setState({ saveBtnTooltipText: 'Copied!' });
                                        this.showSuccess();
                                      }}
                                    ></i>
                                  </CopyToClipboard>
                                </div>)
                              ) : (
                                <label className="text-100">-</label>
                              )}
                            </small>

                          </div>
                          <div>
                            <Button
                              icon="pi pi-pencil"
                              className="p-button-outlined p-button-success mr-0 tbtnsm"
                              onClick={() =>
                                this.onClick(
                                  'displayBasic',
                                  'center',
                                  array[index].walletAddress
                                )
                              }
                            />
                          </div>
                          <div className="ml-1">
                            <Button
                              icon="pi pi-trash"
                              className="p-button-outlined p-button-danger mr-0 tbtnsm"
                              onClick={() => {
                                this.confirmPosition('center');
                                this.setState({
                                  walletAddress: array[index].walletAddress,
                                });
                                this.setState({ addrName: array[index].adrName });
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              :
              <ProgressBar mode="indeterminate" style={{ height: '6px' }} />}

          </Card>
        </div>
      </div>
    );
  }
}

export default Settings;
