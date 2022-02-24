import { Card } from 'primereact/card'
import { TabPanel, TabView } from 'primereact/tabview'
import React, { Component } from 'react'
import Binanceapp from './Binanceapp'
import Celsius from './Celsius'
import Gemini from './Gemini'
import Nexo from './Nexo'
import Wazirx from './Wazirx'

export default class Cefi extends Component {
    render() {
        return (
            <div className="lg:col-10 lg:col-offset-1 md:col-8 md:col-offset-2 sm:col-12 sm:col-offset-0">
            <div className="text-3xl text-bold mb-2 text-700">CeFi</div>
            <Card className='shadow-2'>
                <TabView>
                    <TabPanel header="Nexo">
                        <Nexo />
                    </TabPanel>
                    <TabPanel header="Celsius">
                        <Celsius />
                    </TabPanel>
                    <TabPanel header="Binance">
                        <Binanceapp />
                    </TabPanel>
                    <TabPanel header="Gemini">
                        <Gemini />
                    </TabPanel>
                    <TabPanel header="WazirX">
                        <Wazirx />
                    </TabPanel>
                </TabView>
            </Card>
            </div>
        )
    }
}
