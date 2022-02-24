import React, { Component } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import Moralis from 'moralis';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Constants } from '../utils/Constants';
import { ProgressBar } from 'primereact/progressbar';

Moralis.start({
  serverUrl: 'https://f7mqa6kqgmvv.usemoralis.com:2053/server',
  appId: 'quQQbCVVZ4YpnZGO19HFLFZh6kwi6Uesn8WauriW',
});
export default class NFT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nft: [],
      displayMaximizable: false,
      value: [],
      selectedAddress: [],
      update: props.loading,
      loading: true,
    };
  }
  componentDidMount = async () => {
    const address = []
    const publicAddress = window.localStorage.getItem('publicAddress')
    const b = await axios.get(`${Constants.BASE_URL}/getDetails/${publicAddress}`);
    b.data.results.address.map((value, index, array) => {
      const data = {
        label:
          array[index].adrName == undefined
            ? `${array[index].walletAddress.slice(0, 30)}...`
            : array[index].adrName,
        code: array[index].walletAddress,
      };
      address.push(data)
    });
    this.setState({ selectedAddress: b.data.results.address });
    this.getResults();
    console.log(this.state.selectedAddress);
  };


  getResults = () => {
    const NFT = [];
    const selectedAddress = this.state.selectedAddress;
    console.log(selectedAddress);
    selectedAddress.map(async (value, index, array) => {
      const options = { address: array[index].walletAddress };
      const polygonNFTs = await Moralis.Web3API.account.getNFTs(options);
      console.log(polygonNFTs);
      const NFTs = [];
      polygonNFTs.result.map((value, index, array) => {
        if (array[index].metadata !== null) {
          NFTs.push(JSON.parse(array[index].metadata));
        }
      });
      const address = array[index].walletAddress;
      console.log(NFTs);
      NFTs.map((item, index, array) => {
        if (array[index].image.slice(0, 4) === 'ipfs') {
          const image = `https://ipfs.io/ipfs/${array[index].image.slice(7)}`;
          const data = {
            name: array[index].name,
            attributes: `${array[index].attributes}`,
            description: array[index].description,
            image: image,
            video: false,
            address: address,
          };
          NFT.push(data);
        } else if (
          array[index].image.slice(array[index].image.length - 3) === 'mp4'
        ) {
          const data = {
            name: array[index].name,
            attributes: `${array[index].attributes}`,
            description: array[index].description,
            video: array[index].image,
            address: address,
            // contractAddress: 
          };
          NFT.push(data);
        } else {
          const data = {
            name: array[index].name,
            attributes: `${array[index].attributes}`,
            description: array[index].description,
            image: array[index].image,
            video: false,
            address: address,
          };
          NFT.push(data);
        }
      });
    });
    this.setState({ nft: NFT, });
    setTimeout(() => {
      this.setState({ loading: false })
    }, 800);
    console.log(NFT);
  };

  onClick(name, position, value) {
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
    this.setState({ value: value });
  }

  onHide(name) {
    this.setState({
      [`${name}`]: false,
    });
  }

  render() {
    return (
      <div className="lg:col-10 lg:col-offset-1 md-8 md:col-offset-2 sm-12 sm:col-offset-0">
        <div className="text-3xl text-bold mb-2 text-700">NFTs</div>

        {!this.state.loading ?
          <Card>
            {this.state.nft.length == 0 && (
              <div className="col-4 col-offset-4 text-center">
                <h1>No NFTs yet</h1>
              </div>
            )}

            <div className="grid">
              <Dialog
                header={this.state.value.name}
                visible={this.state.displayMaximizable}
                maximizable
                modal
                style={{ width: '60vw' }}
                onHide={() => this.onHide('displayMaximizable')}
              >
                <strong>Description:</strong>
                <br />
                <div className="mb-3">{this.state.value.description}</div>
                <strong>Owned by:</strong>
                <br />
                <div>{this.state.value.address}</div>
              </Dialog>


              {this.state.nft.map((value, index, array) => {
                if (array[index].video == false)
                  return (
                    <div
                      style={{ cursor: 'pointer' }}
                      className="col-12 md:col-6 lg:col-4 my-3"
                      onClick={() =>
                        this.onClick('displayMaximizable', 'center', array[index])
                      }
                    >
                      <div className="text-center">
                        <img
                          src={array[index].image}
                          style={{
                            height: 'auto',
                            maxWidth: '100%',
                            borderRadius: '3%',
                          }}
                          alt={array[index].description}
                        />
                      </div>
                      <h3>{array[index].name}</h3>
                    </div>
                  );
                else {
                  return (
                    <div
                      className="col-12 md:col-6 lg:col-4 my-3 "
                      onClick={() =>
                        this.onClick('displayMaximizable', 'center', array[index])
                      }
                    >
                      <div style={{ cursor: 'pointer' }} className="text-center">
                        <video
                          autoplay="true"
                          width="100%"
                          loop={true}
                          style={{
                            height: 'auto',
                            maxWidth: '100%',
                            borderRadius: '3%',
                          }}
                        >
                          <source src={array[index].video} type="video/mp4" />
                        </video>
                      </div>
                      <h3>{array[index].name}</h3>
                    </div>
                  );
                }
              })}
            </div>
          </Card> : <Card><ProgressBar mode="indeterminate" style={{ height: '6px' }} /></Card>}


      </div>
    );
  }
}
