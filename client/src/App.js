import React, {useEffect, useState} from "react";
import CryptoCoders from "./contracts/CryptoCoders.json";
import getWeb3 from "./getWeb3";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import * as net from "net";

const App = () => {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState("");
    const [coders, setCoder] = useState([]);
    const [mintText, setMintText] = useState("");

    const loadNFTS = async (contract) => {
        const totalSupply = await contract.methods.totalSupply().call();
        let results = [];
        for (let i = 0; i < totalSupply; i++) {
            let coder = await contract.methods.coders(i).call();
            results.push(coder);
        }
        console.log(results);
        setCoder(results);
    }

    // load web3 account
    const loadWeb3Account = async (web3) => {
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        if (accounts)
        {
            setAccount(accounts[0]);
        }
    }

    // load web3 contract from metamask
    const loadWeb3Contract = async (web3) => {
        const networkId = await web3.eth.net.getId();
        const networkData = CryptoCoders.networks[networkId];
        if (networkData)
        {
            const abi = CryptoCoders.abi;
            const address = networkData.address;
            const contract = new web3.eth.Contract(abi, address);
            setContract(contract);
            return contract;
        }
    }

    const mint = () => {
        console.log(mintText);
        contract.methods.mint(mintText).send({ from: account }, (error) => {
            console.log("worked");
            if (!error) {
                setCoder([...coders, mintText]);
                setMintText("");
            }
        });
    }

    // load all nft

    useEffect(async () => {
        const web3 = await getWeb3();
        await loadWeb3Account(web3);
        const contract = await loadWeb3Contract(web3);
        console.log(contract);
        await loadNFTS(contract);
    }, []);


    return <div>
        <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Crypto coder</a>
            </div>
        </nav>
        <div className="container-fluid mt-5">
            <div className="row">
                <div className="col d-flex flex-column align-items-center">
                    <img className="my-4" width="72" src="https://avatars.dicebear.com/api/pixel-art/quando.svg" alt=""/>
                    <h1 className="display-5 fw-bold">Crypto coders</h1>
                    <div className="col-6 flex-column align-items-center">
                        <p className="lead text-center">this is description</p>
                    </div>
                    <div>
                        <input type="text"
                               placeholder="enter your name"
                               className="form-control mb-2"
                               value={mintText}
                               onChange={(e) => setMintText(e.target.value)}
                        />
                        <button className="btn btn-primary"
                                onClick={mint}
                        >
                            Mint
                        </button>
                    </div>
                    <div className="col-8 d-flex">
                        {
                            coders.map((coder, key) => <div key={key} className="d-flex flex-column justify-content-center flex-wrap">
                                <img src={`https://avatars.dicebear.com/api/pixel-art/${coder}.svg`} alt="" width="72"/>
                                <p>{coder}</p>
                            </div>)
                        }
                    </div>

                </div>
            </div>
        </div>
        
    </div>;
}

export default App;
