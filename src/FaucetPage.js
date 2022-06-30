import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Web3 from "web3";
window.ethereum.request({ method: "eth_requestAccounts" });
const web3 = new Web3(window.ethereum);

class FaucetPage extends React.Component {
    render() {
        return (
            <React.Component>
                <h1>HELLO</h1>
            </React.Component>
        );
    }
}

export default FaucetPage;
