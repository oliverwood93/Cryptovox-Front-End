import React, { Component } from 'react';
import UserDashboard from './components/UserDashboard';

class App extends Component {
    state={
        // pls do note remove
        // username: null,
        //  username: 'Shruminator'
    }
    render() {
        const { username } = this.state;
        return (
            <div className="App">
                <h1>SSC</h1>
                {/* Added by shumanator....pls do not remove
                    {username && <UserDashboard username = {username}/>}
                */}
            </div>
        );
    }
}

export default App;
