import React from 'react'
import 'primeflex/primeflex.css';
import axios from 'axios';
import Web3 from 'web3';
import { Constants } from '../utils/Constants';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
// import { Link } from "react-router-dom";

const Banner = () => {

  const web3 = new Web3(window.web3.currentProvider);

  const handleClick = async () => {
    const publicAddress = (
      await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
    )[0];
    if (!publicAddress) {
      window.alert('Please activate MetaMask first.');
    }
    try {
      const response = await axios.post(`${Constants.BASE_URL}/metamask`, {
        publicAddress: publicAddress,
        walletAddress: publicAddress,
      });
      const nonce = response.data.nonce;
      const msg = await handleSignMessage({ publicAddress, nonce });
      console.log(msg);
      const jwt = await handleAuthenticate(msg);
      console.log('token:', jwt);
      if (jwt.success) {
        window.sessionStorage.setItem('access-token', jwt.token);
        window.localStorage.setItem('publicAddress', publicAddress);
        window.location = '/';
      } else {
        console.log('Login Fail');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignMessage = function ({ publicAddress, nonce }) {
    return new Promise(function (resolve, reject) {
      return web3.eth.personal.sign(
        web3.utils.utf8ToHex('I am signing my one-time nonce: ' + nonce),
        publicAddress,
        function (err, signature) {
          if (err) return reject(err);
          return resolve({
            publicAddress: publicAddress,
            signature: signature,
          });
        }
      );
    });
  };

  const handleAuthenticate = async function ({ publicAddress, signature }) {
    const res = await fetch(`${Constants.BASE_URL}/verifyMetamask`, {
      body: JSON.stringify({
        publicAddress: publicAddress,
        signature: signature,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    return await res.json();
  };

  const connetWallet = async () => {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
    });

    // Check if connection is already established
    if (!connector.connected) {
      // create new session
      connector.createSession();
    }
    console.log(connector, 'connect')

    setInterval(async () => {
      const publicAddress = connector.accounts[0]
      if (publicAddress !== undefined) {
        try {
          await axios.post(`${Constants.BASE_URL}/metamask`, { publicAddress: publicAddress, walletAddress: publicAddress, })
            .then(res => {
              console.log(res)
            })
            .catch(err => {
              console.log(err)
            })
        }
        catch (err) {
          console.log(err);
        }

        const jwt = await handleVerfication(publicAddress)
        if (jwt.success) {
          window.sessionStorage.setItem("access-token", jwt.token);
          window.localStorage.setItem("publicAddress", publicAddress)
          window.location = '/';
        }
        else {
          console.log("Login Fail");
        }
      }
    }, 1000);
  }

  const handleVerfication = async (publicAddress) => {
    return fetch(`${Constants.BASE_URL}/verifyWallet`, {
      body: JSON.stringify({ publicAddress: publicAddress }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(function (res) { return res.json(); });
  }

  return (
    <>
      <div id="feedbackbutton">
        <a href='#' class="feedback">Feedback <i className="pi pi-user-edit"></i></a>
      </div>

      <div className="grid pt-0 m-0" style={{ backgroundColor: '#fef5ee' }}>
        <div className="col-12 md:col-4 lg-4 pl-6 col-align-center">
          <h3 style={{ color: '#d61f1f' }}>Plutus: Your home to Web3</h3>
          <h1 className='text-indigo-800 text-5xl'>App that keeps you at in sync with DeFi</h1>
          <p className='text-600'>Manage all your Wallets and DeFi Investments at one place.</p>
          <button className="p-button p-component p-button-sm" onClick={() => handleClick()}><span class="p-button-icon-right pi pi-arrow-right"></span>Connect Wallet</button>
          <button className="p-button p-component p-button-sm" onClick={() => connetWallet()}><span class="p-button-icon-right pi pi-arrow-right"></span>Connect Wallet</button>

        </div>
        <div className="col-12 md:col-8 lg:col-8"><img className='imgCustom' src='./images/banner_pic.jpeg' /></div>
      </div>

      <div className="grid p-0 m-0 ">
        <div className="col-12 md:col-10 lg:col-10 md:col-offset-1 lg:col-offset-1">
          <div className='custom-position-size'>
            <div className="grid p-0 m-0 shadow-3">
              <div className="col-12 md:col-3 lg:col-3 col-align-center"><img className='imgCustom' src='images/illustration-idc-promo.original.png' /></div>
              <div className="col-12 md:col-7 lg:col-9 col-align-center"><h2 style={{ color: '#030b5d' }}> 360 Degree view of your DeFi investments at one place.</h2>
                <p>Detailed Breakdown of your Investments<br />
                  Manage Multiple Wallets at once<br />
                  Insightful Dashboard for CeFi Investments<br />
                  Swap or Send Tokens<br />
                  Manage your NFTs<br />
                  And More
                </p></div>
            </div>
          </div>

        </div>
      </div>

      <br /><br />





    </>
  );
}

export default Banner

