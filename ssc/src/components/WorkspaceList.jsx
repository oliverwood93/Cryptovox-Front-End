import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { makeAPICalls } from '../utils/apiCalls';
import WorkspaceAdder from './WorkspaceAdder';

class WorkspaceList extends Component {

    state = {
        workspaces: [],
        newWorkspace: '',
        newWorkspaceAdded: false,
        newWorkspaceError: ''                
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
        const { newWorkspace } = this.state;
        const { username } = this.props;
        if ( newWorkspace !== '' ) {
            const apiObj = {
                url: '/workspaces',
                reqObjectKey: 'workspace_added',
                method: 'post',
                data: { admin: username, name: newWorkspace }
            };
            makeAPICalls( apiObj )
                .then( ( isWorkspaceCreated ) => {
                    if ( isWorkspaceCreated ) {
                        this.setState( { newWorkspace: '', newWorkspaceAdded: true, newWorkspaceError: '' } );
                    } else {
                        this.setState( { newWorkspace: '', newWorkspaceAdded: false, 
                            newWorkspaceError: 'Workspace could not be created' } );
                    }
                    console.log( isWorkspaceCreated );
                    
                } )
                .catch( ( err ) => {
                    console.log( err );
                    this.setState( { newWorkspace: '', newWorkspaceAdded: false, newWorkspaceError: err } );
                } ); 
        } else {
            this.setState( { newWorkspaceAdded: false, newWorkspaceError: 'Workspace cannot be blank' } );
        }
        
    }

    handleNewWorkspaceChange = ( e ) => {        
        this.setState( { newWorkspace: e.target.value, newWorkspaceError: '' } );
    }

    componentDidUpdate ( prevProps, prevState ) {
        const { newWorkspaceAdded } = this.state;
        const { username } = this.props;
        if ( newWorkspaceAdded !== prevState.newWorkspaceAdded ) {
            this.getUserWorkspaces( username );
        }
    }
    componentDidMount() {
        const { username } = this.props;
        this.getUserWorkspaces( username );
    }

    render () {
        const { workspaces, newWorkspaceAdded, newWorkspaceError,newWorkspace } = this.state;
        
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
            {!newWorkspaceAdded && newWorkspaceError !== '' 
                && <Alert variant="danger">{newWorkspaceError} </Alert>}
            <WorkspaceAdder newWorkspace={newWorkspace} handleNewWorkspaceChange={this.handleNewWorkspaceChange} 
                handleAddWorkspace={this.handleAddWorkspace}/>            
            </>
        );
    }    
}

WorkspaceList.propTypes = {
    username: PropTypes.string
};

export default WorkspaceList;