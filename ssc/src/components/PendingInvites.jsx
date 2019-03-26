import React, { Component } from "react";
import { makeAPICalls } from "../utils/apiCalls";
import { Button } from "react-bootstrap";

class PendingInvites extends Component {
  state = {
    invites: [],
    isClicked: false
  };
  render() {
    const { invites } = this.state;

    return (
      <div>
        <Button variant="warning" onClick={this.handleNotification}>
          View notifications
        </Button>
        {this.state.isClicked &&
          invites.map(invite => {
            return (
              <div key={invite.workspace}>
                {invite.invited_by} added you to {invite.workspace}
              </div>
            );
          })}
      </div>
    );
  }
  componentDidMount() {
    this.fetchInvites();
  }
  fetchInvites = () => {
    const { username } = this.props;

    const apiObj = {
      url: `/invites/${username}`,
      reqObjectKey: "invites",
      method: "get"
    };
    makeAPICalls(apiObj)
      .then(invites => {
        this.setState({ invites });
      })
      .catch(err => {
        this.setState({ invites: [] });
      });
  };

  handleNotification = () => {
    this.setState({ isClicked: !this.state.isClicked });
  };
}

export default PendingInvites;
