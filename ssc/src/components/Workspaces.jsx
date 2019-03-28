/* eslint-disable complexity */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import WorkspaceList from './WorkspaceList';
import { Button, Badge, Col, Row, Alert, Card, CardColumns } from 'react-bootstrap';
import { makeAPICalls } from '../utils/apiCalls';
import DeleteWorkspaceModal from './DeleteWorkspaceModal';
import WorkspaceUsersList from './WorkspaceUsersList';
import Encryption from './Encryption';
import WorkspaceFilesList from './WorkspaceFilesList';

class Workspaces extends Component {
    state = {
        selectedWorkspace: null,
        deleteError: '',
        refreshList: false,
        showDeleteConfirm: false,
        showUploadPane: false
    };

    componentDidUpdate( prevProps, prevState ) {
        if (
            this.props.refreshWorkspaces !== prevProps.refreshWorkspaces &&
            this.props.refreshWorkspaces
        ) {
            this.setState( { refreshList: true } );
        }
    }
    switchToViewFiles = () => {
        this.setState( { showUploadPane: false } );
    };

    refreshDone = () => {
        this.setState( { refreshList: false } );
    };

    handleCloseModal = () => {
        this.setState( { showDeleteConfirm: false } );
    };

    handleWorkspaceClicked = e => {
        this.setState( {
            selectedWorkspace: {
                workspace: e.target.textContent,
                isAdmin: e.target.dataset.admin
            },
            deleteError: '',
            refreshList: false,
            showUploadPane: false
        } );
    };

    handleDeleteWorkspace = () => {
        if ( this.selectedWorkspace === null ) {
            this.setState( {
                deleteError: 'Workspace must be selected',
                refreshList: false
            } );
        } else {
            this.setState( { showDeleteConfirm: true } );
        }
    };

    deleteWorkspace = () => {
        const { workspace } = this.state.selectedWorkspace;
        const { username } = this.props;

        const apiObj = {
            url: '/workspaces',
            reqObjectKey: 'workspace_deleted',
            data: { deleted_by: username, workspace: workspace },
            method: 'delete'
        };
        makeAPICalls( apiObj )
            .then( workspace_deleted => {
                if ( workspace_deleted ) {
                    this.setState( {
                        deleteError: '',
                        selectedWorkspace: null,
                        refreshList: true,
                        showDeleteConfirm: false
                    } );
                } else {
                    this.setState( {
                        deleteError: 'Workspace could not be deleted',
                        refreshList: false,
                        showDeleteConfirm: false
                    } );
                }
            } )
            .catch( err => {
                this.setState( {
                    deleteError: 'Workspace could not be deleted',
                    refreshList: false,
                    showDeleteConfirm: false
                } );
            } );
    };

    render() {
        const {
            selectedWorkspace,
            deleteError,
            refreshList,
            showDeleteConfirm,
            showUploadPane
        } = this.state;
        const { username } = this.props;
        return (
            <div className="dashbord">
                <div className="workspaces">
                    <Card className="workspaceListCol">
                        {selectedWorkspace !== null && selectedWorkspace.isAdmin === 'true' && (
                            <Button
                                className="del-workspace-btn"
                                variant="danger"
                                onClick={this.handleDeleteWorkspace}
                            >
                                Delete Workspace
                            </Button>
                        )}
                        {deleteError !== '' && <Alert variant="danger">{deleteError} </Alert>}

                        {selectedWorkspace && (
                            <div className="current-space-container">
                                {' '}
                                <Badge className="space-header" variant="dark">
                                    Workspace: {selectedWorkspace.workspace}
                                </Badge>
                            </div>
                        )}
                        <WorkspaceList
                            refreshList={refreshList}
                            username={username}
                            handleWorkspaceClicked={this.handleWorkspaceClicked}
                            refreshDone={this.refreshDone}
                        />
                    </Card>
                </div>
                <div className="file-section-container">
                    {selectedWorkspace !== null && (
                        <div className="file-option-button">
                            <Button
                                variant="outline-primary"
                                className="view-file-button"
                                disabled={!showUploadPane}
                                onClick={() => this.setState( { showUploadPane: false } )}
                            >
                                View Files
                            </Button>
                            <Button
                                variant="outline-primary"
                                className="upload-file-button"
                                disabled={showUploadPane}
                                onClick={() => this.setState( { showUploadPane: true } )}
                            >
                                Upload File
                            </Button>
                        </div>
                    )}
                    {!selectedWorkspace && <Alert variant="warning">Please select or create a workspace</Alert>}
                    {selectedWorkspace !== null && !showUploadPane && (
                        <Fragment>
                            <CardColumns className="filesStyle">
                                <WorkspaceFilesList
                                    username={username}
                                    workspace={selectedWorkspace.workspace}
                                    refreshDone={this.refreshDone}
                                />
                            </CardColumns>
                        </Fragment>
                    )}
                    {showUploadPane && (
                        <Encryption
                            workspace={selectedWorkspace.workspace}
                            switchToViewFiles={this.switchToViewFiles}
                        />
                    )}
                </div>
                <div className="workspacesUserCol">
                    {selectedWorkspace !== null && (
                        <WorkspaceUsersList
                            username={username}
                            workspace={selectedWorkspace.workspace}
                            refreshDone={this.refreshDone}
                        />
                    )}
                </div>
                {showDeleteConfirm && (
                    <DeleteWorkspaceModal
                        showDeleteConfirm={showDeleteConfirm}
                        deleteWorkspace={this.deleteWorkspace}
                        handleCloseModal={this.handleCloseModal}
                    />
                )}
            </div>
        );
    }
}

Workspaces.propTypes = {
    username: PropTypes.string
};

export default Workspaces;
