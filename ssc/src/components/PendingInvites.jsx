import React, { Component } from "react";
import { getInvites } from "../utils/apiCalls";
import { Button } from "react-bootstrap";

class PendingInvites extends Component {
  state = {
    inviteList: [],
    isClicked: false
  };
  render() {
    const { inviteList } = this.state;

    return (
      <div>
        <Button variant="warning" onClick={this.handleNotification}>
          View notifications
        </Button>
        {this.state.isClicked &&
          inviteList.map(invite => {
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

    getInvites(username)
      .then(invites => {
        const inviteList = invites.data.data.invites;
        console.log(inviteList);
        this.setState({ inviteList });
      })
      .catch(error => {
        return error;
      });
  };

  handleNotification = () => {
    this.setState({ isClicked: !this.state.isClicked });
  };
}

export default PendingInvites;
