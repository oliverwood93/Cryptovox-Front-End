import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { makeAPICalls } from '../utils/apiCalls';
import WorkspaceAdder from './WorkspaceAdder';

class WorkspaceList extends Component {

    state = {
        workspaces: []
    }

    getUserWorkspaces = ( username ) => {
        const apiObj = {
            url: `/users/${ username }`,
            reqObjectKey: 'workspaces',
            method: 'get'
        };
        makeAPICalls( apiObj )
            .then( ( workspaces ) => {
                this.setState( { workspaces } );
            } )
            .catch( ( err ) => {
                this.setState( { workspaces: [] } ); 
            } ); 
    }

    handleAddWorkspace = ( e ) => {
        e.preventDefault();
        console.dir( e.target );
    }

    componentDidMount() {
        const { username } = this.props;
        this.getUserWorkspaces( username );
    }

    render () {
        const { workspaces } = this.state;
        
        return (            
            <>
            {
                workspaces && 
                <div>
                    {workspaces.map( workspace => {
                        return <p key={workspace.workspace}>{workspace.workspace}</p>;                     
                    } )}
                </div>
            }
            <WorkspaceAdder handleAddWorkspace={this.handleAddWorkspace}/>
            </>
        );
    }    
}

WorkspaceList.propTypes = {
    username: PropTypes.string
};

export default WorkspaceList;