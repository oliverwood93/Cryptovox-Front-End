import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

const WorkspaceAdder = ( { handleAddWorkspace } ) => {
    return (
        <Form onSubmit={handleAddWorkspace}>
            <Form.Group controlId="formBasicWorkspaceName">
                <Form.Control type="text" placeholder="Enter new workspace to add" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Add
            </Button>
        </Form>
    );
};

WorkspaceAdder.propTypes = {
    handleAddWorkspace: PropTypes.func
};
export default WorkspaceAdder;