import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DeleteWorkspaceModal = ( { showDeleteConfirm, handleCloseModal, deleteWorkspace } ) => {
    return (
        <Modal show={showDeleteConfirm}>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to delete this workspace?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>No</Button>
                    <Button variant="danger" onClick={deleteWorkspace}>Yes, delete</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>        
    );
};

DeleteWorkspaceModal.propTypes = {
    handleCloseModal: PropTypes.func,
    deleteWorkspace: PropTypes.func,
    showDeleteConfirm: PropTypes.bool    
};

export default DeleteWorkspaceModal;