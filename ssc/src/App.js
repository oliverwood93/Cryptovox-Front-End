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

    handleLogin = () => {
        if ( localStorage.getItem( 'userLoggedIn' ) ) {
            this.setState( { username: localStorage.getItem( 'userLoggedIn' ) } );
            navigate( '/dashboard' );
        }        
    };

    handleLogout = () => {
        localStorage.removeItem( 'userLoggedIn' ); 
        this.setState( { username: null } );
        navigate( '/' );
    };

    componentDidMount () {
        if ( localStorage.getItem( 'userLoggedIn' ) ) {
            this.setState( { username: localStorage.getItem( 'userLoggedIn' ) } );
        } 
    }

    render() {
        const { username } = this.state;
        return (
            <div className="App">
                <Header username={username} handleLogout={this.handleLogout} />
                <Router>
                    <Home path="/" handleLogin={this.handleLogin} />
                    <UserDashboard path="/dashboard" username={username} />
                </Router>
            </div>
        );
    }
}

export default App;
