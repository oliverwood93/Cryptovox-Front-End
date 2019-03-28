/* eslint-disable complexity */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, ListGroup, Button } from 'react-bootstrap';
import { makeAPICalls } from '../utils/apiCalls';
import '../App.css';
import WorkspaceUserAdder from './WorkspaceUserAdder';

class WorkspaceUsersList extends Component {
    state = {
        users: [],
        nonMembers: [],
        filteredUsers: [],
        newUser: '',
        newUserAdded: false,
        newUserError: '',
        workspaceUpdated: false
    };

    getWorkspaceUsers = workspace => {
        const apiObj = {
            url: `/workspaces/${ workspace }/users`,
            reqObjectKey: 'users',
            method: 'get'
        };
        makeAPICalls( apiObj )
            .then( users => {
                this.setState( { users, workspaceUpdated: false }, () => {
                    this.getAllUsers();
                } );
            } )
            .catch( err => {
                this.setState( { users: [], workspaceUpdated: false } );
            } );
    };

    getAllUsers = () => {
        const { users } = this.state;

        const apiObj = {
            url: '/users',
            reqObjectKey: 'users',
            method: 'get'
        };
        makeAPICalls( apiObj )
            .then( allUsers => {
                const nonMembers = [];
                allUsers.forEach( ( { username } ) => {
                    const exists = users.some(
                        user => user.username === username
                    );
                    if ( !exists ) {
                        nonMembers.push( { username } );
                    }
                } );

                this.setState( { nonMembers, workspaceUpdated: false } );
            } )
            .catch( err => {
                this.setState( { nonMembers: [], workspaceUpdated: false } );
            } );
    };

    handleAddUser = e => {
        e.preventDefault();
        const { newUser } = this.state;
        const { username, workspace } = this.props;
        if ( newUser !== '' ) {
            const apiObj = {
                url: '/invites',
                reqObjectKey: 'user_invited',
                method: 'post',
                data: { invitedBy: username, username: newUser, workspace }
            };
            makeAPICalls( apiObj )
                .then( isUserInvited => {
                    if ( isUserInvited ) {
                        this.setState( {
                            newUser: '',
                            newUserAdded: true,
                            newUserError: ''
                        } );
                    } else {
                        this.setState( {
                            newUser: '',
                            newUserAdded: false,
                            newUserError: 'User could not be invited'
                        } );
                    }
                } )
                .catch( err => {
                    this.setState( {
                        newUser: '',
                        newUserAdded: false,
                        newUserError: err
                    } );
                } );
        } else {
            this.setState( {
                newUser: '',
                newUserAdded: false,
                newUserError: 'User cannot be blank'
            } );
        }
    };

    handleNewUserChange = e => {
        const { nonMembers } = this.state;
        const txt = e.target.value;
        const filteredUsers = nonMembers.filter( nonMember =>
            nonMember.username.includes( txt )
        );
        this.setState( {
            newUser: txt,
            newUserError: '',
            newUserAdded: false,
            filteredUsers
        } );
    };

    handleItemClick = e => {
        const { nonMembers } = this.state;
        const txt = e.target.textContent;
        const filteredUsers = nonMembers.filter( nonMember =>
            nonMember.username.includes( txt )
        );
        this.setState( {
            newUser: txt,
            newUserError: '',
            newUserAdded: false,
            filteredUsers
        } );
    };

    handleUpdateAdmin = ( userToUpdate, currentAdminFlag ) => {
        const admin = this.props.username;
        const { workspace } = this.props;
        const newAdminFlag = currentAdminFlag === 'True' ? 'False' : 'True';
        const apiObj = {
            url: `/workspaces/${ workspace }`,
            reqObjectKey: 'workspace_admin_updated',
            method: 'put',
            data: {
                username: userToUpdate,
                admin_username: admin,
                make_admin: newAdminFlag
            }
        };
        makeAPICalls( apiObj )
            .then( workspace_admin_updated => {
                this.setState(
                    { workspaceUpdated: workspace_admin_updated },
                    () => {
                        this.props.refreshDone();
                    }
                );
            } )
            .catch( err => {
                this.setState( { workspaceUpdated: false } );
            } );
    };

    handleRemoveUser = userToDelete => {
        const admin = this.props.username;
        const { workspace } = this.props;

        const apiObj = {
            url: '/deleteUser',
            reqObjectKey: 'user_deleted_from_workspace',
            method: 'delete',
            data: {
                username: userToDelete,
                admin_username: admin,
                workspace_name: workspace
            }
        };
        makeAPICalls( apiObj )
            .then( workspace_admin_updated => {
                this.setState(
                    { workspaceUpdated: workspace_admin_updated },
                    () => {
                        this.props.refreshDone();
                    }
                );
            } )
            .catch( err => {
                this.setState( { workspaceUpdated: false } );
            } );
    };

    componentDidUpdate( prevProps, prevState ) {
        const {
            workspaceUpdated,
            newUserAdded,
            newUser,
            filteredUsers,
            nonMembers
        } = this.state;
        const { workspace } = this.props;
        if ( workspace !== prevProps.workspace ) {
            this.getWorkspaceUsers( workspace );
        } else if ( workspaceUpdated ) {
            this.getWorkspaceUsers( workspace );
        } else if ( newUserAdded !== prevState.newUserAdded ) {
            this.getWorkspaceUsers( workspace );
        } else if (
            newUser === '' &&
            filteredUsers.length === 0 &&
            nonMembers.length !== 0
        ) {
            this.setState( { filteredUsers: nonMembers } );
        }
    }
    componentDidMount() {
        const { workspace } = this.props;
        this.getWorkspaceUsers( workspace );
    }

    render() {
        const {
            users,
            newUserAdded,
            newUserError,
            newUser,
            filteredUsers
        } = this.state;
        const { handleWorkspaceClicked, username } = this.props;
        return (
            <>
                <h3 className="usersTitle">Users</h3>
                {users && (
                    <ListGroup className="fullUserList">
                        {users.map( user => {
                            return (
                                <div
                                    className="singleUserListBlock"
                                    key={user.username}
                                >
                                    <div>
                                        <ListGroup.Item
                                            action
                                            className="singleWorkspaceItem"
                                            onClick={handleWorkspaceClicked}
                                        >
                                            {user.username}
                                        </ListGroup.Item>
                                    </div>

                                    <Button
                                        size="sm"
                                        disabled={user.username === username}
                                        className="makeAdmin"
                                        onClick={() =>
                                            this.handleUpdateAdmin(
                                                user.username,
                                                user.is_admin
                                            )
                                        }
                                    >
                                        {user.is_admin === 'True'
                                            ? 'Remove admin'
                                            : 'Make admin'}
                                    </Button>

                                    <Button
                                        size="sm"
                                        disabled={user.username === username}
                                        className="removeFromWorkspace"
                                        variant="danger"
                                        onClick={() =>
                                            this.handleRemoveUser( user.username )
                                        }
                                    >
                                        Remove user
                                    </Button>
                                </div>
                            );
                        } )}
                    </ListGroup>
                )}
                {!newUserAdded && newUserError !== '' && (
                    <Alert variant="danger">{newUserError} </Alert>
                )}
                {newUserAdded && newUserError === '' && newUser === '' && (
                    <Alert variant="success">User has been invited</Alert>
                )}
                <WorkspaceUserAdder
                    newUser={newUser}
                    filteredUsers={filteredUsers}
                    handleNewUserChange={this.handleNewUserChange}
                    handleAddUser={this.handleAddUser}
                    handleItemClick={this.handleItemClick}
                />
            </>
        );
    }
}

WorkspaceUsersList.propTypes = {
    username: PropTypes.string,
    workspace: PropTypes.string,
    refreshDone: PropTypes.func,
    handleWorkspaceClicked: PropTypes.func
};

export default WorkspaceUsersList;
