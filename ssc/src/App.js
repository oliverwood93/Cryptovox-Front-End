import React, { Component } from 'react';
import { Router } from '@reach/router';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1 className="header">SSC</h1>
                <Router>
                    <Home path="/" />
                    <Dashboard path="/dashboard" />
                </Router>
            </div>
        );
    }
}

export default App;
