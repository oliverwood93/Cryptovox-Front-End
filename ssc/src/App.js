import React, { Component } from 'react';

import { Router, navigate } from '@reach/router';
import Home from './components/Home';
import UserDashboard from './components/UserDashboard';
import Header from './components/Header';
import './App.css';

class App extends Component {
    state = {
        username: null
    };

    handleUpdateUser = username => {
        this.setState( { username } );
    };

    handleLogout = () => {
        this.setState( { username: null } );
        navigate( '/' );
    };

    render() {
        const { username } = this.state;
        return (
            <div className="App">
                <Header username={username} handleLogout={this.handleLogout} />
                <Router>
                    <Home path="/" handleUpdateUser={this.handleUpdateUser} />
                    <UserDashboard path="/dashboard" username={username} />
                </Router>
            </div>
        );
    }
}

export default App;
