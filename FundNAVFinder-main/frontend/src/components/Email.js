import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Toast } from 'primereact/toast';
import { Constants } from '../utils/Constants';
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';
 

class Email extends Component {
  constructor(props) {
    super(props);
    this.state = {
      managerEmail: null,
      validation: true,
      userEmail: false,
      email: null,
      addEmValidation: false,
      emailList: [],
      currentEmail: null,
      managerPass: null,
      userEmailId: null,
      value: '',
      copied: false,
      saveBtnTooltipText: 'Copy to Clipboard',
      userName: '',
      showError: false,
      existError: '',
      loading: true
    };
  }

  componentDidMount = async () => {
    const publicAddress = window.localStorage.getItem('publicAddress')
    const addr = await axios.get(`${Constants.BASE_URL}/getDetails/${publicAddress}`);
    this.setState({ emailList: addr.data.results.guestUser ,loading:false });
    this.setState({ managerPass: addr.data.results.password });
    this.setState({ userEmailId: addr.data.results.managerEmail,loading:false });
  };

  componentDidUpdate = async () => {
    const publicAddress = window.localStorage.getItem('publicAddress')
    const addr = await axios.get(`${Constants.BASE_URL}/getDetails/${publicAddress}`);
    this.setState({
      emailList: addr.data.results.guestUser,
      managerPass: addr.data.results.password,
      userEmailId: addr.data.results.managerEmail,
    });
  };

  handleManagerEmail = async () => {
    const managerEmail = this.state.managerEmail;
    const lowerCase = managerEmail.toLowerCase();
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!lowerCase.match(pattern)) {
      this.setState({ showError: true });
    }
    if (lowerCase.match(pattern)) {
      this.setState({ validation: true });
      const publicAddress = window.localStorage.getItem('publicAddress');
      console.log(publicAddress);
      axios
        .post(`${Constants.BASE_URL}/addManagerEmail`, {
          managerEmail: managerEmail,
          publicAddress: publicAddress,
        })
        .then((res) => {
          res.data.success && this.setState({ userEmail: true, loading: false });
          console.log(res);
        });
    } else {
      this.setState({ validation: false });
    }
  };

  handleEmail = async () => {
    if (this.state.email) {
      const email = this.state.email;
      const name = this.state.userName;
      const lowerCase = email.toLowerCase();
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (lowerCase.match(pattern)) {
        this.setState({ addEmValidation: true });
        const publicAddress = window.localStorage.getItem('publicAddress');

        axios
          .post(`${Constants.BASE_URL}/addEmail`, {
            email: email,
            publicAddress: publicAddress,
            userName: name,
          })
          .then((res) => {
            console.log(res);
            this.setState({ existError: res.data.message, showError: false });
          });
      } else {
        this.setState({
          addEmValidation: false,
          showError: true,
        });
      }
      this.setState({ email: '', userName: '' });
      console.log(this.state.emailList);
    } else {
      this.setState({ showError: true });
    }
  };

  confirmPosition(position) {
    console.log(this.state.currentEmail);
    confirmDialog({
      message: 'Do you want to delete this email?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      position,
      accept: this.accept,
    });
  }

  accept = () => {
    const publicAddress = window.localStorage.getItem('publicAddress');
    const email = this.state.currentEmail;
    axios
      .post(`${Constants.BASE_URL}/delEmail`, {
        publicAddress: publicAddress,
        email: email,
      })
      .then((res) => this.setState({ currentEmail: '' }));
  };

  showSuccess() {
    this.toast.show({
      severity: 'success',
      summary: 'Copied!',
      detail: '',
      life: 1500,
    });
  }

  showSent() {
    this.toast.show({
      severity: 'success',
      summary: 'Email Sent Successfully!',
      detail: '',
      life: 2000,
    });
  }

  sendEmail = (email) => {
    const publicAddress = window.localStorage.getItem('publicAddress');
    axios
      .post(`${Constants.BASE_URL}/resendEmail`, {
        publicAddress: publicAddress,
        email: email,
      })
      .then((res) => {
        console.log(res);
      });
  };

  render() {
    return (
      <div className="lg:col-10 lg:col-offset-1 md-8 md:col-offset-2 sm-12 sm:col-offset-0 mb-4">
        <div className="text-3xl text-bold mb-2 text-700">Email</div>
        <Toast ref={(el) => (this.toast = el)} />
        <Card className="shadow-4">
          {/* {!this.state.userEmailId ? 
           <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>
          : <h1>hello</h1>} */}
          {/* <ProgressBar mode="indeterminate" /> */}
          {this.state.loading ? 
          <ProgressBar mode="indeterminate" style={{ height: '6px' }} /> : 
          <div> 
            {this.state.userEmailId && (
            <div className="grid mb-4 mx-2 mt-2">
              <div className="col">
                <strong>Your Email: {this.state.userEmailId}</strong>
                <br />
                <small>Password: {this.state.managerPass}</small>
                <CopyToClipboard
                  text={this.state.managerPass}
                  onCopy={() => this.setState({ copied: true })}
                >
                  <i
                    style={{ cursor: 'pointer' }}
                    className="pi pi-copy ml-1 mt-1 text-sm"
                    tooltip={this.state.saveBtnTooltipText}
                    onClick={() => {
                      this.setState({ saveBtnTooltipText: 'Copied!' });
                      this.showSuccess();
                    }}
                  ></i>
                </CopyToClipboard>
              </div>
            </div>
          )}
          {!this.state.userEmailId && (
            <div className="formgroup-inline flex mb-3 justify-content-between mx-2">
              <InputText
                className=""
                type="text"
                value={this.state.managerEmail}
                onChange={(e) =>
                  this.setState({ managerEmail: e.target.value })
                }
                className="p-inputtext-sm mx-2 w-9"
                placeholder="Enter Email ID"
              />

              <Button
                label="Add"
                className="mx-2 w-2"
                onClick={this.handleManagerEmail}
              />
            </div>
          )}

          <div>
       
            {this.state.userEmailId && (
              <div>
                <div className="formgroup-inline flex justify-content-between">
                  <div>
                    <InputText
                      type="text"
                      value={this.state.email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                      className="p-inputtext-sm mx-2"
                      placeholder="Add Email ID"
                    />

                    <InputText
                      type="text"
                      value={this.state.userName}
                      onChange={(e) =>
                        this.setState({ userName: e.target.value })
                      }
                      className="p-inputtext-sm mx-2"
                      placeholder="Add name"
                    />
                  </div>
                  <Button
                    label="Add"
                    className="mx-2 w-2"
                    onClick={this.handleEmail}
                  />
                </div>
                <small id="username-help" className="p-error ml-3">
                  {this.state.existError}
                </small>
                {this.state.showError && (
                  <small id="username-help" className="p-error ml-3">
                    Enter a valid Email Address
                  </small>
                )}
                <div>
                  <br />
                  {this.state.emailList.map((item, index, array) => {
                    return (
                      <div>
                        <div className="grid mb-4 mx-2">
                          <div className="col">
                            <strong>{array[index].userName}</strong>
                            <br />
                            <span>{array[index].email}</span>
                          </div>

                          <div className="ml-1">
                            <Button
                              icon="pi pi-send"
                              className="p-button-outlined p-button-info mr-2 tbtnsm"
                              onClick={() => {
                                this.sendEmail(array[index].email);
                                this.showSent();
                              }}
                            />
                            <Button
                              icon="pi pi-trash"
                              className="p-button-outlined p-button-danger mr-2 tbtnsm"
                              onClick={() => {
                                this.confirmPosition('center');
                                this.setState({
                                  currentEmail: array[index].email,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div></div>}
          
         
        </Card>
      </div>
    );
  }
}

export default Email;
