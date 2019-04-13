import React, { Component } from "react";
import GalleryContract from "./contracts/Gallery.json";
import getWeb3 from "./utils/getWeb3";
import ReactDOM from  "react-dom";
import {
  BrowserRouter,
  NavLink,
  Link,
  Route,
  Switch,
  withRouter
} from 'react-router-dom';

//route pages layout
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import EditInfo from './pages/EditInfo';
import Upload from './pages/Upload';
import Featured from './pages/Featured';
import Details from './pages/Details';
import Author from './pages/Author';
// import Porfolio from './pages/Porfolio';

//Import components
import Header from './components/Header';
import NavBar from './components/NavBar';
// import Menu from "./js/demo";

import "./App.css";
import "./css/style.css";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
// cookies.set(, { path: '/' });
// console.log(cookies.get('myCat')); // Pacman

// import  "./css/bootstrap.min.css";
class App extends Component {
  constructor(props){
    super(props);
      this.state= {
          user_id:null,
          name: null,
          web3: null,
          accounts: null,
          contract: null,
          isSignedIn:false,
          login_msg:""
      };

  }

  isSignedIn(){
    let login_URL = "http://localhost:4000/users/login";
    // fetch(login_URL).then{
    fetch(login_URL).then(
      results => results.json()).then(results => this.setState({'login_msg': results})).catch(error => {
        console.log(`400 Login Error when fetching: ${error}`);
        this.setState({isSignedIn:false});
    // }
      });
  }


  //ask for the meta mask account
  async componentDidMount() {
    try {

      // window.alert(this.state.artworks[0].);

      // document.title = "Crypto Gallery";
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GalleryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        GalleryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      // console.error(error);

    }
  }

  checkUserlogin(){
    //
    // if (this.state.login_msg == "rr")
    //
    // if (this.state.login_msg == "rm")
    //
    // if (this.state.login_msg == "rr")

  }



  render() {
    //check the user have an account by logging in to the metamask
    //this.isSignedIn();
    return (

      <div className="App">
        <link rel="stylesheet" href="css/style.css"/>
        <div className="w3-content" style={{ paddingBottom:'80px'}}>

          <BrowserRouter>
          <div className="w3-panel w3-center w3-opacity" >
            <h1 className="text-center"><Link exact activeClassName="current" to='/'>Agora</Link></h1>
              <hr/>

              </div>

          <NavBar/>

                <div className="Container">
            <Switch>

              <Route exact path={"/"} component={Home} />

                <Route path={"/about"} component={About}/>
                <Route exact path={"/featured"} component={Featured} />
                <Route path={"/gallery"} component={Gallery}/>
                <Route path={"/upload"} component={Upload}/>
                <Route path={"/author"} component={Author}/>
                <Route path={"/artworks/details"} component={Details}/>

              </Switch>
                </div>
          </BrowserRouter>
          <div className="footer-account">
            <p id="accountAddress" className="text-center" alt="account">account : {this.state.accounts}</p>
          </div>

        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/web3.min.js"></script>
      </div>

    );
  }
}

export default App;
