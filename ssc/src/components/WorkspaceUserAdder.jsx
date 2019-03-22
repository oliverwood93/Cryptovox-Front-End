import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

const WorkspaceUserAdder = ( { handleAddUser, handleNewUserChange, newUser } ) => {    
    console.log( newUser );
    return (
        <Form onSubmit={handleAddUser}>
            <Form.Group controlId="formBasicUserName">
                <Form.Control type="text" value = {newUser} placeholder="Enter new User to add" onChange={handleNewUserChange}/>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={newUser === ''}>
                Add
            </Button>
        </Form>
    );
};

WorkspaceUserAdder.propTypes = {
    handleAddUser: PropTypes.func,
    handleNewUserChange: PropTypes.func,
    newUser: PropTypes.string
};
export default WorkspaceUserAdder;