import React, { Component } from 'react';
import UserDashboard from './components/UserDashboard';

class App extends Component {
    state={
        // username: null,
        username: 'Shruminator'
    }
    render() {
        const { username } = this.state;
        return (
            <div className="App">
                <h1>SSC</h1>
                {username && <UserDashboard username = {username}/>}                
            </div>
        );
    }
}

export default App;
