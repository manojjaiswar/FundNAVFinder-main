import React from 'react'

const Footer = () => {
 return (
  <>

   <div style={{ backgroundColor: '#0d112b' }} className='p-4'>
    <div className='text-center'>
     <h1 className='footerHeading'>We can't wait to see what you build.</h1>
    </div>
    <div className='col-12 md:col-10 grid-nogutter lg:col-10 md:col-offset-1 lg:col-offset-1'>
     {/* <div className="grid p-0 m-0 ">

      <div className="col-12 md:col-3 lg:col-3">
       <p className='text-50'>PRODUCTS</p>
       <div id="related_links">
        <ul>
         <li><a href="#!">Voice</a></li>
         <li><a href="#!">Video</a></li>
         <li><a href="#!">Messaging</a></li>
         <li><a href="#!">Authentication</a></li>
         <li><a href="#!">IoT</a></li>
        </ul>
       </div>
      </div>

      <div className="col-12 md:col-3 lg:col-3">
       <p className='text-50'>SOLUTIONS</p>
       <div id="related_links">
        <ul>
         <li><a href="#!">Account Security</a></li>
         <li><a href="#!">Text Marketing</a></li>
         <li><a href="#!">Commerce Communications</a></li>
         <li><a href="#!">Contact Center</a></li>
        </ul>
       </div>
      </div>

      <div className="col-12 md:col-3 lg:col-3">
       <p className='text-50'>DOCS</p>
       <div id="related_links">
        <ul>
         <li><a href="#!">Quickstarts</a></li>
         <li><a href="#!">Tutorials</a></li>
         <li><a href="#!">API Reference</a></li>
         <li><a href="#!">Helper Libraries</a></li>
         <li><a href="#!">API Status</a></li>
        </ul>
       </div>
      </div>

      <div className="col-12 md:col-3 lg:col-3">
       <p className='text-50'>COMPANY</p>
       <div id="related_links">
        <ul>
         <li><a href="#!">About Twilio</a></li>
         <li><a href="#!">What is Twilio?</a></li>
         <li><a href="#!">Trusted Communications</a></li>
         <li><a href="#!">Customers</a></li>
         <li><a href="#!">Get Help</a></li>
         <li><a href="#!">Talk to an expert</a></li>
         <li><a href="#!">Press & Media</a></li>
         <li><a href="#!">Public Policy</a></li>
         <li><a href="#!">Investor Relations</a></li>
         <li><a href="#!">Events</a></li>
         <li><a href="#!">Jobs at Twilio</a></li>
        </ul>
       </div>
      </div>

     </div>
     <br /><br /> */}

     <div className='text-center'>
      <div id="menu">
       <ul>
        <li><a href="index.php">Home</a></li>
        <li><a href="about.php">About Us</a></li>
        <li><a href="offers.php">Special Offers</a></li>
        <li><a href="staff.php">Meet Our Staff</a></li>
        <li><a href="contact.php">Contact</a></li>
       </ul>
      </div>
      <p className='text-xs text-200'>
       COPYRIGHT © 2022 PRIDEVEL INC. <br />
       ALL RIGHTS RESERVED.
      </p>
     </div>

    </div>
   </div>
  </>
 )
}

export default Footer