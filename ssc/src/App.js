import React, { Component } from 'react';

import { Router } from '@reach/router';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import './App.css';

class App extends Component {
    state = {
        // pls do note remove
        // username: null,
        username: 'Coddzilla'
    };
    render() {
        const { username } = this.state;
        return (
            <div className="App">
                <h1 className="header">SSC</h1>
                <Router>
                    <Home path="/" />
                    <Dashboard path="/dashboard" />
                    {/* Added by shumanator....pls do not remove*/}
                    {username && <UserDashboard username={username} />}
                </Router>
            </div>
        );
    }
}

export default App;
