import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, ListGroup } from 'react-bootstrap';
import { makeAPICalls } from '../utils/apiCalls';
import WorkspaceAdder from './WorkspaceAdder';
import '../App.css';

class WorkspaceList extends Component {
    state = {
        workspaces: [],
        newWorkspace: '',
        newWorkspaceAdded: false,
        newWorkspaceError: ''
    };

    getUserWorkspaces = username => {
        const apiObj = {
            url: `/users/${ username }`,
            reqObjectKey: 'workspaces',
            method: 'get'
        };
        makeAPICalls( apiObj )
            .then( workspaces => {
                this.setState( { workspaces }, () => {
                    this.props.refreshDone();
                } );
            } )
            .catch( err => {
                this.setState( { workspaces: [] } );
            } );
    };

    isWorkspaceValid = name => {
        /* 
                AWS bucket rules:
                - Should not contain uppercase characters
                - Should not contain underscores (_)
                - Should be between 3 and 63 characters long
                - Should not end with a dash
                - Cannot contain two, adjacent periods
                - Cannot contain dashes next to periods (e.g., "my-.bucket.com" and "my.-bucket" are invalid)
        */

        const regex = /([A-Z_]*)((\.\.)\1+)*(\.\-)*(\-\.)*(-$)*/g;
        const validLength = name.length >= 3 && name.length <= 63;
        const regexMatch = name.match( regex );
        const regexInvalid = regexMatch.every( el => {
            return ( el = '' );
        } );
        const isValid = !regexInvalid && validLength;
        return isValid;
    };

    handleAddWorkspace = e => {
        e.preventDefault();
        const { newWorkspace } = this.state;
        const { username } = this.props;
        if ( newWorkspace !== '' && this.isWorkspaceValid( newWorkspace ) ) {
            const apiObj = {
                url: '/workspaces',
                reqObjectKey: 'workspace_added',
                method: 'post',
                data: { admin: username, name: newWorkspace }
            };
            makeAPICalls( apiObj )
                .then( isWorkspaceCreated => {
                    if ( isWorkspaceCreated ) {
                        this.setState( {
                            newWorkspace: '',
                            newWorkspaceAdded: true,
                            newWorkspaceError: ''
                        } );
                    } else {
                        this.setState( {
                            newWorkspace: '',
                            newWorkspaceAdded: false,
                            newWorkspaceError: 'Workspace could not be created'
                        } );
                    }
                } )
                .catch( err => {
                    this.setState( {
                        newWorkspace: '',
                        newWorkspaceAdded: false,
                        newWorkspaceError: err
                    } );
                } );
        } else {
            if ( newWorkspace === '' ) {
                this.setState( { newWorkspaceAdded: false, newWorkspaceError: 'Workspace cannot be blank' } );
            } else {
                this.setState( {
                    newWorkspaceAdded: false,
                    newWorkspaceError:
                        'Workspace must be 3-63 characters, cannot contain uppercase or underscore, must not end in dash, should not have 2 adjacent period and dashes cannot be next to periods.'
                } );
            }
        }
    };

    handleNewWorkspaceChange = e => {
        this.setState( { newWorkspace: e.target.value, newWorkspaceError: '' } );
    };

    componentDidUpdate( prevProps, prevState ) {
        const { newWorkspaceAdded } = this.state;
        const { username, refreshList } = this.props;
        if ( newWorkspaceAdded !== prevState.newWorkspaceAdded ) {
            this.getUserWorkspaces( username );
        } else if ( refreshList && refreshList !== prevProps.refreshList ) {
            this.getUserWorkspaces( username );
        }
    }
    componentDidMount() {
        const { username } = this.props;
        this.getUserWorkspaces( username );
    }

    render() {
        const { workspaces, newWorkspaceAdded, newWorkspaceError, newWorkspace } = this.state;
        const { handleWorkspaceClicked } = this.props;
        return (
            <>
                {workspaces && (
                    <ListGroup className="workspaceList">
                        {workspaces.map( workspace => {
                            return (
                                <ListGroup.Item
                                    data-admin={workspace.is_admin.toString()}
                                    key={workspace.workspace}
                                    action
                                    className="singleWorkspaceItem"
                                    onClick={handleWorkspaceClicked}
                                >
                                    {workspace.workspace}
                                </ListGroup.Item>
                            );
                        } )}
                    </ListGroup>
                )}
                {!newWorkspaceAdded && newWorkspaceError !== '' && (
                    <Alert variant="danger">{newWorkspaceError} </Alert>
                )}
                <WorkspaceAdder
                    newWorkspace={newWorkspace}
                    handleNewWorkspaceChange={this.handleNewWorkspaceChange}
                    handleAddWorkspace={this.handleAddWorkspace}
                />
            </>
        );
    }
}

WorkspaceList.propTypes = {
    username: PropTypes.string,
    handleWorkspaceClicked: PropTypes.func,
    refreshList: PropTypes.bool,
    refreshDone: PropTypes.func
};

export default WorkspaceList;
