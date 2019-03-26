import React, { Component } from "react";
import PropTypes from "prop-types";
import WorkspaceList from "./WorkspaceList";
import { Button, Container, Col, Row, Alert, Card } from "react-bootstrap";
import { makeAPICalls } from "../utils/apiCalls";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";
import WorkspaceUsersList from "./WorkspaceUsersList";
import WorkspaceFilesList from "./WorkspaceFilesList";

class Workspaces extends Component {
  state = {
    selectedWorkspace: null,
    deleteError: "",
    refreshList: false,
    showDeleteConfirm: false
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
  };

  render() {
    const {
      selectedWorkspace,
      deleteError,
      refreshList,
      showDeleteConfirm
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
            <Card className="workspaceFilelist">
              <p>Files come here</p>
              {selectedWorkspace !== null && (
                <WorkspaceFilesList
                  username={username}
                  workspace={selectedWorkspace.workspace}
                  refreshDone={this.refreshDone}
                />
              )}
            </Card>
          </Col>
          <Col className="workspacesUserCol">
            <Card className="workspaceUserlistCol">
              {selectedWorkspace !== null && (
                <WorkspaceUsersList
                  username={username}
                  workspace={selectedWorkspace.workspace}
                  refreshDone={this.refreshDone}
                />
              )}
            </Card>
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
