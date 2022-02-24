
 import React from "react";
 import Web3 from 'web3';
import Banner from "./landing/Banner";
import { TabViewDemo } from "./landing/TabView/TabViewDemo";
import Footer from "./landing/Footer";
import MyNav from "./landing/navbar/MyNav";
 
 const web3 = new Web3(window.web3.currentProvider)
 class Login extends React.Component {
   constructor(props) {
     super(props);
   } 
   render() {
     return (
       <div>
              <Banner />
              <br /><br />
              <TabViewDemo />
              {/* <UpcomingEvents /> */}
              <br /><br />
              <Footer />
       </div>
     );
   }
 }
 export default Login;
 