<<<<<<< HEAD
import React, { Component } from "react";
import UserDashboard from "./components/UserDashboard";

class App extends Component {
  state = {
    // pls do note remove
    // username: null,
    username: "Coddzilla"
  };
  render() {
    const { username } = this.state;
    return (
      <div className="App">
        <h1>SSC</h1>
        {/* Added by shumanator....pls do not remove*/}
        {username && <UserDashboard username={username} />}
      </div>
    );
  }
=======
import React, { Component } from 'react';

import { Router } from '@reach/router';
import Home from './components/Home';
import UserDashboard from './components/UserDashboard';
import './App.css';

class App extends Component {
    state = {
        username: null,

    };

    handleUpdateUser = ( username ) => {        
        this.setState( { username } );
    }
    render() {
        const { username } = this.state;        
        return (
            <div className="App">

                <h1 className="header">SSC</h1>
                <Router>
                    <Home path="/" handleUpdateUser={this.handleUpdateUser}/>
                    <UserDashboard path="/dashboard" username={username} />
                </Router>

            </div>
        );
    }
>>>>>>> 63dc66d29e5705948294876888d807f8964c9019
}

export default App;
