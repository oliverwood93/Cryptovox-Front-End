import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const WorkspaceAdder = ({ handleAddWorkspace, handleNewWorkspaceChange, newWorkspace }) => {
    return (
        <Form onSubmit={handleAddWorkspace} className="workspaceAdder">
            <Form.Group className="workspace-form-group" controlId="formBasicWorkspaceName">
                <Form.Control
                    className="workspace-add-input"
                    type="text"
                    value={newWorkspace}
                    placeholder="Enter new workspace to add"
                    onChange={handleNewWorkspaceChange}
                    autoComplete="off"
                />
            </Form.Group>
            <Button
                className="workspace-adder-btn"
                variant="primary"
                type="submit"
                disabled={newWorkspace === ''}
            >
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
