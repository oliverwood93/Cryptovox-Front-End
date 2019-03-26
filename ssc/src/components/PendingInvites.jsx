import React, { Component } from "react";
import { makeAPICalls } from "../utils/apiCalls";
import { Dropdown, Alert, Button } from "react-bootstrap";

class PendingInvites extends Component {
  state = {
    invites: [],
    invitesError: ""
  };
  render() {
    const { invites, invitesError } = this.state;

    return (
      <div className="invitesDiv">
        {invitesError !== "" && <Alert variant="danger">{invitesError}</Alert>}
        {invites.length > 0 ? (
          <Dropdown>
            <Dropdown.Toggle
              className="invitesList"
              variant="warning"
              id="dropdown-custom-1"
            >
              View Invites
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {invites &&
                invites.map(invite => {
                  return (
                    <>
                      <Dropdown.Item
                        key={invite.workspace}
                        eventKey={invite.workspace}
                      >
                        {invite.invited_by} added you to {invite.workspace}
                        <span
                          className="acceptRejectSpan"
                          onClick={() =>
                            this.acceptReject(invite.workspace, "True")
                          }
                        >
                          ✅
                        </span>
                        <span
                          className="acceptRejectSpan"
                          onClick={() =>
                            this.acceptReject(invite.workspace, "False")
                          }
                        >
                          ❌
                        </span>
                      </Dropdown.Item>
                    </>
                  );
                })}
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Alert variant="primary">No pending invites</Alert>
        )}
      </div>
    );
  }
  componentDidMount() {
    this.fetchInvites();
  }

  acceptReject = (workspace, accept) => {
    const { username } = this.props;
    const apiObj = {
      url: `/invites/${username}`,
      reqObjectKey: "invite_processed",
      method: "post",
      data: { accept, workspace }
    };
    makeAPICalls(apiObj)
      .then(invite_processed => {
        if (invite_processed) {
          this.fetchInvites();
          this.props.handleRefresh();
        } else {
          this.setState({ invitesError: "Could not accept/reject invite" });
        }
      })
      .catch(err => {
        this.setState({ invitesError: "Could not accept/reject invite" });
      });
  };

  fetchInvites = () => {
    const { username } = this.props;

    const apiObj = {
      url: `/invites/${username}`,
      reqObjectKey: "invites",
      method: "get"
    };
    makeAPICalls(apiObj)
      .then(invites => {
        this.setState({ invites, invitesError: "" });
      })
      .catch(err => {
        this.setState({ invites: [], invitesError: "Could not get invites" });
      });
  };
}

export default PendingInvites;
