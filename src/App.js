import "./App.css";
import React from "react";
import lottery from "./lottery";
import "bootstrap/dist/css/bootstrap.min.css";
import Web3 from "web3";
window.ethereum.request({ method: "eth_requestAccounts" });
const web3 = new Web3(window.ethereum);

export default class App extends React.Component {
    state = { manager: "", players: [], balance: "", value: "", message: "", playerBalances: {}, isMounted: false };

    async componentDidMount() {
        const manager = await lottery.methods.manager().call();

        this.setState(
            {
                players: await lottery.methods.getPlayers().call(),
                balance: await web3.eth.getBalance(lottery.options.address),
            },
            async () => {
                for (let i of this.state.players) {
                    let temp = this.state.playerBalances;
                    temp[i] = await lottery.methods.getPlayerBet(i).call();
                    this.setState({ playerBalances: temp });
                }

                this.setState({ manager });
            }
        );

        this.setState({
            isMounted: true,
        });
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

    adminFunctions = async () => {
        const accounts = await web3.eth.getAccounts();
        const manager = await lottery.methods.manager().call();
        console.log(accounts[0], manager);
        if (accounts[0] === manager) {
            return (
                <>
                    <h1>Admin Panel</h1>
                    <form className="mt-5">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">For the admin to pick a winner </label>
                        </div>
                        <button onClick={this.onPick} type="submit" className="btn btn-danger mt-2">
                            Pick Winner and Conclude Game
                        </button>
                    </form>
                </>
            );
        }
    };

    showParticipants = () => {
        return (
            <>
                <table className="table table-warning table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Address</th>
                            <th scope="col">Bet (Testnet Klay)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.playerBalances?Object.keys(this.state.playerBalances).map(function (keyName, keyIndex) {
                            return (
                                <tr key={keyName}>
                                    <td>{keyIndex}</td>
                                    <td>{keyName}</td>
                                    {/* <td>{this.state.playerBalances[keyName]}</td> */}
                                </tr>
                            );
                        }):<></>}
                    </tbody>
                </table>
            </>
        );
    };

    render() {
        return (
            <div className="App container pt-5 pb-5">
                <nav className="navbar navbar-expand-lg bg-light mb-5">
                    <div className="container-fluid">
                        <div className="navbar-brand">Klaytn Exploration</div>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="navbar-nav">
                            <div className="nav-link">Lottery Contract</div>
                        </div>
                    </div>
                </nav>
                <h2>Baobab Testnet Lottery Game</h2>
                <p>This lottery contract is deployed and managed by {this.state.manager}.</p>
                <p>
                    There are currently {this.state.players.length} people entered competing to win {web3.utils.fromWei(this.state.balance, "ether")} testnet Klay!
                </p>

                {this.showParticipants()}

                <p>
                    Get your testnet Klay from the faucet <a href="https://baobab.wallet.klaytn.foundation/faucet">here!</a>
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
                <h1>{this.state.message}</h1>
                <>
                    <h1 className="mt-5">Admin Panel</h1>
                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">For the admin to pick a winner </label>
                        </div>
                        <button onClick={this.onPick} type="submit" className="btn btn-danger mt-2">
                            Pick Winner and Conclude Game
                        </button>
                    </form>
                </>
            </div>
        );
    }
}
