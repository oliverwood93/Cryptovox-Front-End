import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Alert, ListGroup, Button, Col, Row } from 'react-bootstrap';
import { makeAPICalls } from '../utils/apiCalls';
import WorkspaceAdder from './WorkspaceAdder';
import '../App.css';

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

    /* handleAddWorkspace = ( e ) => {
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
                    
                } )
                .catch( ( err ) => {                    
                    this.setState( { newWorkspace: '', newWorkspaceAdded: false, newWorkspaceError: err } );
                } ); 
        } else {
            this.setState( { newWorkspaceAdded: false, newWorkspaceError: 'Workspace cannot be blank' } );
        }
        
    }
 */
    
    /* handleNewWorkspaceChange = ( e ) => {        
        this.setState( { newWorkspace: e.target.value, newWorkspaceError: '' } );
    } */

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

        //req: {'username': 'xxx', 'admin_username': 'xxx', 'make_admin': 'True/False'}

    }

    componentDidUpdate ( prevProps, prevState ) {        
        /* const { newWorkspaceAdded } = this.state;        
        const { username, refreshList } = this.props;
        if ( newWorkspaceAdded !== prevState.newWorkspaceAdded ) {
            this.getUserWorkspaces( username );
        } else if ( refreshList && refreshList !== prevProps.refreshList ) {
            this.getUserWorkspaces( username );
        }  */ 
        const { workspaceUpdated } = this.state;
        const { workspace } = this.props;
        if ( workspace !== prevProps.workspace ) {
            this.getWorkspaceUsers( workspace );
        } else if ( workspaceUpdated ) {
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
                                            <Button /* data-username={user.username}  */onClick={() => this.handleUpdateAdmin( user.username, user.is_admin )}>
                                                {user.is_admin === 'True' ? 'Remove user from admin' : 'Make user admin'}
                                            </Button> 
                                        </Col> 

                                        <Col>
                                            <Button>Remove user</Button> 
                                        </Col>
                                    </>
                                    : <></>                            
                            }                                                                                      
                        </Row>;
                        
                    } )}                    
                </ListGroup>
            }
            {/* !newUserAdded && newUserError !== '' 
                && <Alert variant="danger">{newUserError} </Alert> */}
            {/* <WorkspaceAdder newWorkspace={newUser} handleNewUserChange={this.handleNewUserChange} 
                handleAddUser={this.handleAddUser}/>      */}       
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