import React from 'react';
import './Navbar.css';
import './myNavJS.js'

class MyNav extends React.Component {
 render() {
  return (
   <>
    {/* <div className='topHeader'>
     <a className='topHeader' href='#!'>Support</a>
     <a className='topHeader' href='#!'>Login</a>
    </div> */}

    <div class="header" id="myHeader" className='sticky'>
     <section className="navigation menu">
      <div className="nav-container">
       <div className="brand">
        <a href="#"><img alt="logo" src="images/brandName.png" height="50"></img></a>
       </div>
       <nav>
        <div className="nav-mobile"><a id="nav-toggle" href="#!"><span></span></a></div>
        {/* <ul className="nav-list"> */}
         {/* <li>
          <a href="#!">Home</a>
         </li>
         <li>
          <a href="#!">About</a>
         </li>
         <li>
          <a href="#!">Services</a>
          <ul className="nav-dropdown">
           <li>
            <a href="#!">Web Design</a>
           </li>
           <li>
            <a href="#!">Web Development</a>
           </li>
           <li>
            <a href="#!">Graphic Design</a>
           </li>
          </ul>
         </li>
         <li>
          <a href="#!">Pricing</a>
         </li>
         <li>
          <a href="#!">Portfolio</a>
          <ul className="nav-dropdown">
           <li>
            <a href="#!">Web Design</a>
           </li>
           <li>
            <a href="#!">Web Development</a>
           </li>
           <li>
            <a href="#!">Graphic Design</a>
           </li>
          </ul>
         </li>
         <li>
          <a href="#!">Contact</a>
         </li>
        </ul> */}
       </nav>

      </div>
     </section>
    </div>
   </>
  );
 }
}
export default MyNav

