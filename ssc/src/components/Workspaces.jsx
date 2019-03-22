import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WorkspaceList from './WorkspaceList';

class Workspaces extends Component {    

    state = {

    }

    render () {
        const { username } = this.props;
        return (
            <>
              <p>Workspace List</p>
              <WorkspaceList username={username}/>
            </>
        );
    }    
}

Workspaces.propTypes = {
    username: PropTypes.string
};

export default Workspaces;