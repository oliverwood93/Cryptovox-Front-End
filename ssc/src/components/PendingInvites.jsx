import React, { Component } from "react";

import { getInvites, respond } from "../utils/apiCalls";

import { Button } from "react-bootstrap";

class PendingInvites extends Component {
  state = {
    inviteList: [],

    isClicked: false,
    response: null
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
                {invite.invited_by} invited you to {invite.workspace}
                <Button
                  variant="success"
                  onClick={() => {
                    this.handleResponse("True", invite.workspace);
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    this.handleResponse("False", invite.workspace);
                  }}
                >
                  Reject
                </Button>
              </div>
            );
          })}
      </div>
    );
  }
  componentDidMount() {
    this.fetchInvites();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.response !== prevProps.response) {
      console.log("hello");
    }
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

  handleResponse = (answer, workspace) => {
    const { response } = this.state;
    respond(this.props.username, { response, workspace });
    this.setState({ response: answer });
  };
}

export default PendingInvites;
