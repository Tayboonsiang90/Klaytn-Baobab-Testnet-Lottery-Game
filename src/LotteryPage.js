import "./App.css";
import React from "react";
import lottery from "./lottery";
import "bootstrap/dist/css/bootstrap.min.css";
import Web3 from "web3";
window.ethereum.request({ method: "eth_requestAccounts" });
const web3 = new Web3(window.ethereum);

export default class LotteryPage extends React.Component {
    state = { manager: "", players: [], balance: "", value: "", message: "" };

    async componentDidMount() {
        const manager = await lottery.methods.manager().call();
        this.setState({
            players: await lottery.methods.getPlayers().call(),
            balance: await web3.eth.getBalance(lottery.options.address),
        });

        this.setState({ manager });
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({ message: "Waiting on transaction to complete..." });

        await lottery.methods.joinLottery().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, "ether"),
        });

        this.setState({ message: "Your lottery entry is successful!" });
    };

    onPick = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        await lottery.methods.pickWinner().send({
            from: accounts[0],
        });

        this.setState({ message: "A winner has been picked!" });
    };

    render() {
        return (
            <div className="App container pt-5 pb-5">
                <nav className="navbar navbar-expand-lg bg-dark mb-5">
                    <div className="container-fluid">
                        <div className="navbar-brand">Navbar</div>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav">
                                <div className="nav-link active" aria-current="page">
                                    Home
                                </div>
                                <div className="nav-link">Features</div>
                                <div className="nav-link">Pricing</div>
                            </div>
                        </div>
                    </div>
                </nav>
                <h2>Baobab Testnet Lottery Game</h2>
                <p>This lottery contract is managed by {this.state.manager}.</p>
                <p>
                    There are currently {this.state.players.length} people entered competing to win {web3.utils.fromWei(this.state.balance, "ether")} testnet Klay!
                </p>
                <form className="mt-5">
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Amount of testnet Klay to enter the lottery: </label>
                        <input onChange={(event) => this.setState({ value: event.target.value })} value={this.state.value} type="number" className="form-control" id="exampleInputEmail1" placeholder="0"></input>
                    </div>
                    <button onClick={this.onSubmit} type="submit" className="btn btn-success mt-2">
                        Join Lottery
                    </button>
                </form>

                <form className="mt-5">
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">For the admin to pick a winner </label>
                    </div>
                    <button onClick={this.onPick} type="submit" className="btn btn-danger mt-2">
                        Pick Winner and Conclude Game
                    </button>
                </form>

                <h1>{this.state.message}</h1>
            </div>
        );
    }
}
