import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Alert, ListGroup, Button, Col, Row } from 'react-bootstrap';
import { makeAPICalls } from '../utils/apiCalls';
import WorkspaceAdder from './WorkspaceAdder';
import '../App.css';
import WorkspaceUserAdder from './WorkspaceUserAdder';

class WorkspaceUsersList extends Component {

    state = {
        users: [],
        newUser: '',
        newUserAdded: false,
        newUserError: '' , 
        workspaceUpdated: false    
    }

    getWorkspaceUsers = ( workspace ) => {        
        const apiObj = {
            url: `/workspaces/${ workspace }/users`,
            reqObjectKey: 'users',
            method: 'get'
        };
        makeAPICalls( apiObj )
            .then( ( users ) => {
                this.setState( { users, workspaceUpdated: false }, () => {
                    this.props.refreshDone();
                } );                
            } )
            .catch( ( err ) => {
                this.setState( { users: [], workspaceUpdated: false } ); 
            } ); 
    }

    handleAddUser = ( e ) => {
        e.preventDefault();
        const { newUser } = this.state;
        const { username, workspace } = this.props;
        console.log( newUser, workspace, username );
        if ( newUser !== '' ) {
            const apiObj = {
                url: '/invites',
                reqObjectKey: 'user_invited',
                method: 'post',
                data: { invitedBy: username, username: newUser, workspace }
            };
            makeAPICalls( apiObj )
                .then( ( isUserInvited ) => {
                    if ( isUserInvited ) {
                        this.setState( { newUser: '', newUserAdded: true, newUserError: '' } );
                    } else {
                        this.setState( { newUser: '', newUserAdded: false, 
                            newUserError: 'User could not be invited' } );
                    }
                    
                } )
                .catch( ( err ) => {                    
                    this.setState( { newUser: '', newUserAdded: false, newUserError: err } );
                } ); 
        } else {
            this.setState( { newUser: '', newUserAdded: false, newUserError: 'User cannot be blank' } );
        }
        
    }
    
    handleNewUserChange = ( e ) => {   
        this.setState( { newUser: e.target.value, newUserError: '', newUserAdded: false } );
    }

    handleUpdateAdmin = ( userToUpdate, currentAdminFlag ) => {
        const admin = this.props.username;
        const { workspace } = this.props;
        const newAdminFlag = currentAdminFlag === 'True' ? 'False' : 'True';        
        const apiObj = {
            url: `/workspaces/${ workspace }`,
            reqObjectKey: 'workspace_admin_updated',
            method: 'put',
            data: { username: userToUpdate, admin_username: admin, make_admin: newAdminFlag }
        };
        makeAPICalls( apiObj )
            .then( ( workspace_admin_updated ) => {
                this.setState( { workspaceUpdated: workspace_admin_updated }, () => {
                    this.props.refreshDone();
                } );                
            } )
            .catch( ( err ) => {
                this.setState( { workspaceUpdated: false } ); 
            } );

    }

    handleRemoveUser = ( userToDelete ) => {
        const admin = this.props.username;
        const { workspace } = this.props;
        
        const apiObj = {
            url: '/deleteUser',
            reqObjectKey: 'user_deleted_from_workspace',
            method: 'delete',
            data: { username: userToDelete, admin_username: admin, workspace_name: workspace }
        };
        makeAPICalls( apiObj )
            .then( ( workspace_admin_updated ) => {
                this.setState( { workspaceUpdated: workspace_admin_updated }, () => {
                    this.props.refreshDone();
                } );                
            } )
            .catch( ( err ) => {
                this.setState( { workspaceUpdated: false } ); 
            } );

        //req: {'username': 'xxx', 'admin_username': 'xxx', 'workspace': 'yyy'}

    }

    componentDidUpdate ( prevProps, prevState ) {        
        /* const { newUserAdded } = this.state;        
        const { username, refreshList } = this.props;
        if ( refreshList && refreshList !== prevProps.refreshList ) {
            this.getUserWorkspaces( username );
        }  */ 
        const { workspaceUpdated, newUserAdded } = this.state;
        const { workspace } = this.props;
        if ( workspace !== prevProps.workspace ) {
            this.getWorkspaceUsers( workspace );
        } else if ( workspaceUpdated ) {
            this.getWorkspaceUsers( workspace );
        } else if ( newUserAdded !== prevState.newUserAdded ) {
            this.getWorkspaceUsers( workspace );
        }
    }
    componentDidMount() {        
        const { workspace } = this.props;        
        this.getWorkspaceUsers( workspace );
    }

    render () {
        const { users, newUserAdded, newUserError,newUser } = this.state;
        const { handleWorkspaceClicked, username } = this.props;        
        return (            
            <>
            {
                users && 
                <ListGroup>
                    {users.map( user => {
                        
                        return <Row key={user.username} >                        
                            <Col>
                                <ListGroup.Item
                                    action className="singleWorkspaceItem" onClick={handleWorkspaceClicked}>{
                                        user.username}
                                </ListGroup.Item>
                            </Col>
                            {
                                user.username !== username
                                    ? <>
                                        <Col>
                                            <Button onClick={() => this.handleUpdateAdmin( user.username, user.is_admin )}>
                                                {user.is_admin === 'True' ? 'Remove user from admin' : 'Make user admin'}
                                            </Button> 
                                        </Col> 

                                        <Col>
                                            <Button variant="danger" onClick={() => this.handleRemoveUser( user.username )}>Remove user</Button> 
                                        </Col>
                                    </>
                                    : <></>                            
                            }                                                                                      
                        </Row>;
                        
                    } )}                    
                </ListGroup>
            }
            {!newUserAdded && newUserError !== '' 
                && <Alert variant="danger">{newUserError} </Alert>}
            {newUserAdded && newUserError == '' && newUser === ''
            && <Alert variant="success">User has been invited</Alert>}
            {<WorkspaceUserAdder newUser={newUser} handleNewUserChange={this.handleNewUserChange} 
                handleAddUser={this.handleAddUser}/> }       
            </>
        );
    }    
}

WorkspaceUsersList.propTypes = {
    username: PropTypes.string,
    workspace: PropTypes.string,
    refreshDone: PropTypes.func,
    handleWorkspaceClicked: PropTypes.func,
    /* refreshList: PropTypes.bool,
     */
};

export default WorkspaceUsersList;