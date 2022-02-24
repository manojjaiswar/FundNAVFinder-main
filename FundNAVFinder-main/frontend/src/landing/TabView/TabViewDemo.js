import React, { Component } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { SplitButton } from 'primereact/splitbutton';
import { Avatar } from 'primereact/avatar';
import './TabViewDemo.css';

import { Divider } from 'primereact/divider';

export class TabViewDemo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex1: 1,
            activeIndex2: 0
        }

        this.tabHeaderITemplate = this.tabHeaderITemplate.bind(this);
        this.tabHeaderIITemplate = this.tabHeaderIITemplate.bind(this);
        this.tabHeaderIIITemplate = this.tabHeaderIIITemplate.bind(this);
    }

    tabHeaderITemplate(options) {
        return (
            <button type="button" onClick={options.onClick} className={options.className}>
                <i className="pi pi-prime mr-2" />
                {options.titleElement}
            </button>
        );
    }

    tabHeaderIIITemplate(options) {
        const items = [
            { label: 'Update', icon: 'pi pi-refresh' },
            { label: 'Delete', icon: 'pi pi-times' },
            { label: 'Upload', icon: 'pi pi-upload' }
        ];

        return (
            <SplitButton label="Header III" icon="pi pi-plus" onClick={options.onClick} className="px-2" model={items}></SplitButton>
        )
    }

    tabHeaderIITemplate(options) {
        return (
            <div className="flex p-ai-center px-3" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <Avatar image="images/avatar/amyelsner.png" onImageError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} shape="circle" className="mx-2" />
                Amy Elsner
            </div>
        )
    }

    render() {
        // const scrollableTabs = Array.from({ length: 50 }, (_, i) => ({ title: `Tab ${i + 1}`, content: `Tab ${i + 1} Content` }))

        return (

            <>
                <div className="tabview-demo">
                    <TabView>
                        <TabPanel header="Overview">
                            <div className="grid p-0 m-0 flex align-items-center justify-content-start">
                                <div className="col-12 md:col-4 lg:col-4">
                                    <img alt='Test' className='imgCustom' src='./images/cryptocurrency-hero.jpg' />
                                </div>

                                <div className="col-12 md:col-8 lg:col-8">
                                    <h1 className='text-3xl text-indigo-800 ml-5'>360 Degree view of your DeFi investments at one place.</h1>
                                    <p className='ml-5'>Detailed Breakdown of your Investments
                                        Manage Multiple Wallets at once
                                    </p>
                                    <a className='custom-btn2 ml-5' href='#'>Explore the platform</a>
                                </div>

                            </div>
                        </TabPanel>

                        <TabPanel header="Connect">
                            <div className="grid p-0 m-0 flex align-items-center justify-content-start">
                                <div className="col-12 md:col-8 lg:col-8">
                                    <h1 className='text-3xl text-indigo-800'>Transform your customer experience</h1>
                                    <p>Create the exact solution you need to engage customers at every step of their journey. Twilio is a single platform with flexible APIs for any channel, built-in intelligence, and global infrastructure to support you at scale.</p>
                                    <a className='custom-btn2' href='#'>Explore the platform</a>
                                </div>

                                <div className="col-12 md:col-4 lg:col-4">
                                    <img alt='Test' className='imgCustom' src='./images/cryptocurrency1.jpg' />
                                </div>

                            </div>
                        </TabPanel>
                        <TabPanel header="Engage">
                            <div className="grid p-0 m-0 flex align-items-center justify-content-start">
                                <div className="col-12 md:col-4 lg:col-4">
                                    <img alt='Test' className='imgCustom' src='./images/cryptocurrency2.jpg' />
                                </div>

                                <div className="col-12 md:col-8 lg:col-8">
                                    <h1 className='text-3xl text-indigo-800 ml-5'>Transform your customer experience</h1>
                                    <p className='ml-5'>Create the exact solution you need to engage customers at every step of their journey. Twilio is a single platform with flexible APIs for any channel, built-in intelligence, and global infrastructure to support you at scale.</p>
                                    <a className='custom-btn2 ml-5' href='#'>Explore the platform</a>
                                </div>

                            </div>
                        </TabPanel>
                    </TabView>

                </div>

                {/* <br /><br /> */}

                <Divider />
                <br />
                {/* <div style={{ backgroundColor: '#ffffff' }}>
                    <div className="text-center">
                        <h1 className='text-6xl text-indigo-800'>Built With Twilio</h1>
                    </div>
                    <br />

                    <div className='col-12 md:col-8 lg:col-8 md:col-offset-2 lg:col-offset-2 shadow-2'>
                        <div className="grid p-0 m-0">
                            <div className="col-12 md:col-6 lg:col-6 text-center">
                                <img className='imgCustom' src='./images/Marks_Spencer.jpg' />
                            </div>
                            <div className="col-12 md:col-6 lg:col-6">
                                <p className='text-3xl text-indigo-800'>
                                    Marks & Spencer reinvents their global call center with Twilio
                                </p>
                                <p>
                                    Retail giant Marks & Spencer uses Twilio to deliver the same quality of customer service you’d find in a store, over the phone. Using Twilio, they deliver personalized support, powering over $10M in new sales.
                                </p>
                                <a href='#!'>Read more</a>
                            </div>
                        </div>

                        <div className='custom-height'></div>
                        <div className="grid p-0 m-0">
                            <div className="col-12 md:col-3 lg:col-3 text-center">
                                <img className='imgCustom' src='./images/ebay.jpg' />
                            </div>
                            <div className="col-12 md:col-3 lg:col-3">
                                <p className='text-3xl text-indigo-800'>
                                    eBay
                                </p>
                                <p>
                                    eBay automates ticket buyer & seller communications with Twilio.
                                </p>
                                <a href='#!'>Read more</a>
                            </div>
                            <div className="col-12 md:col-3 lg:col-3 text-center">
                                <img className='imgCustom' src='./images/zendesk.jpg' />
                            </div>
                            <div className="col-12 md:col-3 lg:col-3">
                                <p className='text-3xl text-indigo-800'>
                                    Zendesk
                                </p>
                                <p>
                                    Zendesk gives voice to customers in 40 countries and counting.
                                </p>
                                <a href='#!'>Read more</a>
                            </div>
                        </div>

                    </div>

                </div> */}
                {/* <br /><br /><br /> */}
                <div className='col-12 md:col-8 lg:col-8 md:col-offset-2 lg:col-offset-2'>
                    <img className='imgCustom' src='./images/logos.jpg' />
                    {/* <div className='text-center'><a className='custom-btn3' href='#'>Read and Report</a> </div> */}
                </div>
                <br /><br />
                {/* <div className="grid p-0 m-0 grid-nogutter">
                    <div className='col-12 md:col-6 lg:col-6 bg-orange-100'>
                        <img className='imgCustom' src='./images/signal.jpg' />
                    </div>
                    <div className='col-12 md:col-6 lg:col-6 p-6 bg-orange-100'>
                        <div className='p-6'>
                            <p className='text-lg'>SIGNAL 2021</p>
                            <div class="custom-border"></div>
                            <h1 className='text-6xl text-indigo-900'>What’s next: The top five customer engagement trends of 2022</h1>
                            <div class="custom-border"></div>
                            <br />
                            <a style={{ fontWeight: 300, color: 'gray' }} href='#!'>Read more on The Current <i className="pi pi-arrow-up-right"></i> </a>
                        </div>
                    </div>
                </div> */}


                {/* <div style={{ backgroundColor: '#fef5ef' }}>
                    <br /><br /><br /><br />
                    <div className='col-12 md:col-8 grid-nogutter lg:col-8 md:col-offset-2 lg:col-offset-2'>
                        <div className="grid p-0 m-0 ">
                            <div className="col-12 md:col-6 lg:col-6">
                                <h1 className='text-4xl text-indigo-900'>How to Use Email and SMS Notifications Together</h1>
                                <p>
                                    Twilio’s SMS and SendGrid email APIs are perfect for when you need to let your users know what’s going on in multiple channels.
                                </p>
                                <a href='#!'>Watch the video <i className="pi pi-arrow-up-right"></i></a>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6 text-center">
                                <img className='imgCustom' src='./images/sms_email.jpg' />
                            </div>

                        </div>
                        <br /><br /><br /><br />
                        <div className="grid p-0 m-0 ">
                            <div className="col-12 md:col-6 lg:col-6 text-center">
                                <img className='imgCustom' src='./images/build_an_audio.jpg' />
                            </div>
                            <div className="col-12 md:col-6 lg:col-6">
                                <h1 className='text-4xl text-indigo-900 ml-5'>Build an Audio Livestream App with Twilio Live</h1>
                                <p className='ml-5'>
                                The amount of online audio content and livestreams is increasing every day. More and more, people are tuning into audio for news, music, fitness, study, and entertainment.
                                </p>
                                <a className='ml-5' href='#!'>Read more  <i className="pi pi-arrow-up-right"></i></a>
                            </div>


                        </div>



                    </div>
                    <br /><br /><br /><br />
                </div> */}


            </>


        )
    }
}
