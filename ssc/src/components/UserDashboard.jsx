import React from 'react';
import PropTypes from 'prop-types';
import Workspaces from './Workspaces';

const UserDashboard = ( { username } ) => {    
    return (
        <div>
            <h1>Hello {username}</h1>
            <p>Invites come here</p>
            <Workspaces username={username}/>
        </div>
    );
};

UserDashboard.propTypes = {
    username: PropTypes.string
};

export default UserDashboard;