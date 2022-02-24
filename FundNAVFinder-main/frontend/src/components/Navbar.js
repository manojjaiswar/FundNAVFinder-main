import React, { Component } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import Avalanche from './Avalanche';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.items = [
      {
        label: 'Explore on',
        icon: 'pi pi-th-large',
        items: [
          {
            label: 'Ethereum',
            command: () => {
              window.location = '/onEthereum'}
          },
          {
            label: 'Binance',
            command: () => {
              window.location = '/onBinance'}
          },
          {
            label: 'Polygon',
            command: () => {
              window.location = '/onPolygon'}
          },
          {
            label: 'Avalanche',
            command: () => {
              window.location = '/onAvalanche'}
          },
        ],
      },
    ];
  }

  render() {
    const start = <h2>FundNAV</h2>;
    const end = <Button label="Sign Out" className="p-button" />;

    return (
      <div>
        <div>
          <Menubar style={{backgroundColor:"white"}} model={this.items} start={start} end={end} />
        </div>
      </div>
    );
  }
}

export default Navbar;
