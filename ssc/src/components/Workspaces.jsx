import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import WorkspaceList from "./WorkspaceList";
import {
  Button,
  Container,
  Col,
  Row,
  Alert,
  Card,
  CardColumns
} from "react-bootstrap";
import { makeAPICalls } from "../utils/apiCalls";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";
import WorkspaceUsersList from "./WorkspaceUsersList";
import Encryption from "./Encryption";
import WorkspaceFilesList from "./WorkspaceFilesList";

class Workspaces extends Component {
  state = {
    selectedWorkspace: null,
    deleteError: "",
    refreshList: false,
    showDeleteConfirm: false,
    showUploadPane: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.refreshWorkspaces !== prevProps.refreshWorkspaces &&
      this.props.refreshWorkspaces
    ) {
      this.setState({ refreshList: true });
    }
  }

  refreshDone = () => {
    this.setState({ refreshList: false });
  };

  handleCloseModal = () => {
    this.setState({ showDeleteConfirm: false });
  };

  handleWorkspaceClicked = e => {
    this.setState({
      selectedWorkspace: {
        workspace: e.target.textContent,
        isAdmin: e.target.dataset.admin
      },
      deleteError: "",
      refreshList: false
    });
  };

  handleDeleteWorkspace = () => {
    if (this.selectedWorkspace === null) {
      this.setState({
        deleteError: "Workspace must be selected",
        refreshList: false
      });
    } else {
      this.setState({ showDeleteConfirm: true });
    }
  };

  deleteWorkspace = () => {
    const { workspace } = this.state.selectedWorkspace;
    const { username } = this.props;

    const apiObj = {
      url: "/workspaces",
      reqObjectKey: "workspace_deleted",
      data: { deleted_by: username, workspace: workspace },
      method: "delete"
    };
    makeAPICalls(apiObj)
      .then(workspace_deleted => {
        if (workspace_deleted) {
          this.setState({
            deleteError: "",
            selectedWorkspace: null,
            refreshList: true,
            showDeleteConfirm: false
          });
        } else {
          this.setState({
            deleteError: "Workspace could not be deleted",
            refreshList: false,
            showDeleteConfirm: false
          });
        }
      })
      .catch(err => {
        this.setState({
          deleteError: "Workspace could not be deleted",
          refreshList: false,
          showDeleteConfirm: false
        });
      });
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
        <Row>
          <Col>
            {selectedWorkspace !== null &&
              selectedWorkspace.isAdmin === "true" && (
                <Button variant="danger" onClick={this.handleDeleteWorkspace}>
                  Delete Workspace
                </Button>
              )}
            {deleteError !== "" && (
              <Alert variant="danger">{deleteError} </Alert>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="workspaceListCol">
              {selectedWorkspace && <h3>{selectedWorkspace.workspace}</h3>}
              <WorkspaceList
                refreshList={refreshList}
                username={username}
                handleWorkspaceClicked={this.handleWorkspaceClicked}
                refreshDone={this.refreshDone}
              />
            </Card>
          </Col>
          <Col>
            <div className="file-option-button">
              <Button
                disabled={!showUploadPane}
                onClick={() => this.setState({ showUploadPane: false })}
              >
                View Files
              </Button>
              <Button
                disabled={showUploadPane}
                onClick={() => this.setState({ showUploadPane: true })}
              >
                Upload File
              </Button>
            </div>
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
              <Encryption workspace={selectedWorkspace.workspace} />
            )}
          </Col>
          <Col className="workspacesUserCol">
            {selectedWorkspace !== null && (
              <WorkspaceUsersList
                username={username}
                workspace={selectedWorkspace.workspace}
                refreshDone={this.refreshDone}
              />
            )}
          </Col>
        </Row>
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
