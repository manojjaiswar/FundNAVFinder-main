import React, { Component } from 'react';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';

export class UpcomingEvents extends Component {

    render() {
        const header1 = (
            <img alt="Card1" src="images/card1.jpg" />
        );
        const header2 = (
            <img alt="Card1" src="images/card2.jpg" />
        );
        const header3 = (
            <img alt="Card1" src="images/card3.jpg" />
        );

        return (
            <>
                <br /><br />
                <div className='text-center'>
                    <h1 className='text-4xl text-indigo-900'>Upcoming events</h1>
                </div>

                <div className='col-12 md:col-10 grid-nogutter lg:col-10 md:col-offset-1 lg:col-offset-1'>
                    <div className="grid p-0 m-0 ">
                        <div className="col-12 md:col-4 lg:col-4 p-4">
                            <Card className='customEffect' header={header1}>
                                <span style={{ fontSize: '15px' }}>July 7, 2022, 4:00PM - 5:00PM <Chip style={{ fontSize: '10px' }} label=" US/Pacific" /></span>
                                <h1 className='text-2xl text-indigo-900 mb-6'>Building Your Story & Resume for Mission-Driven Companies</h1>

                                <a href='#!'>Register here to receive the recording and resources</a>
                            </Card>

                        </div>
                        <div className="col-12 md:col-4 lg:col-4 p-4">
                            <Card className='customEffect' header={header2}>
                                <span style={{ fontSize: '15px' }}>On Demand — Online <Chip style={{ fontSize: '10px' }} label=" US/Pacific" /></span>
                                <h1 className='text-2xl text-indigo-900 mb-6'>Discovering the Technical Side of Sales</h1>

                                <a href='#!'>Watch the replay</a>
                            </Card>

                        </div>
                        <div className="col-12 md:col-4 lg:col-4 p-4">
                            <Card className='customEffect' header={header3}>
                                <span style={{ fontSize: '15px' }}>July 7, 2022, 4:00PM - 5:00PM <Chip style={{ fontSize: '10px' }} label=" US/Pacific" /></span>
                                <h1 className='text-2xl text-indigo-900 mb-6'>Advancing Women In Tech</h1>

                                <a href='#!'>Register here to receive the recording and resources</a>
                            </Card>

                        </div>

                    </div>

                    <div className='text-center'><a className='custom-btn3' href='#'>View more events</a> </div>
                </div>

                <br /><br /><br /><br /><br /><br /><br /><br />
                <div className='text-center'>
                    <h1 className='text-4xl text-indigo-900'>Get started with Twilio</h1>
                </div>

                <div className='col-12 md:col-10 lg:col-10 md:col-offset-1 lg:col-offset-1'>
                    <div className="grid p-0 m-0 ">
                        <div className="col-12 md:col-4 lg:col-4 text-center">
                            <a className='custom-btn5' href='#'>Sign up</a>
                        </div>
                        <div className="col-12 md:col-4 lg:col-4 text-center">
                            <a className='custom-btn4' href='#'>Talk to sales</a>
                        </div>
                        <div className="col-12 md:col-4 lg:col-4 text-center">
                            <a className='custom-btn4' href='#'>See pricing</a>
                        </div>
                    </div>
                </div>


            </>
        )
    }
}