import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

const WorkspaceAdder = ( { handleAddWorkspace, handleNewWorkspaceChange, newWorkspace } ) => {    
    return (
        <Form onSubmit={handleAddWorkspace} className="workspaceAdder">
            <Form.Group controlId="formBasicWorkspaceName">
                <Form.Control type="text" value = {newWorkspace} placeholder="Enter new workspace to add" onChange={handleNewWorkspaceChange}/>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={newWorkspace === ''}>
                Add
            </Button>
        </Form>
    );
};

WorkspaceAdder.propTypes = {
    handleAddWorkspace: PropTypes.func,
    handleNewWorkspaceChange: PropTypes.func,
    newWorkspace: PropTypes.string
};
export default WorkspaceAdder;