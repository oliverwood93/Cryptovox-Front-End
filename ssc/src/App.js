import React, { Component } from 'react';
import Encryption from './components/Encryption';
import Decryption from './components/Decryption';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>SSC</h1>
                <Encryption />
                <Decryption />
            </div>
        );
    }
}

export default App;
