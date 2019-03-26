import React, { Component } from "react";
import PropTypes from "prop-types";
import Workspaces from "./Workspaces";
import PendingInvites from "./PendingInvites";
import { Row, Col } from "react-bootstrap";

class UserDashboard extends Component {
  state = {
    refreshWorkspaces: false
  };

  handleRefresh = () => {
    this.setState({ refreshWorkspaces: true });
  };

  render() {
    const { refreshWorkspaces } = this.state;
    const {
      location: {
        state: { username }
      }
    } = this.props;
    return (
      <>
        <h1>Hello {username}</h1>
        <Row className="overallDashboard">
          <Col />
          <Col>
            <PendingInvites
              username={username}
              handleRefresh={this.handleRefresh}
            />
          </Col>
        </Row>
        <Workspaces username={username} refreshWorkspaces={refreshWorkspaces} />
      </>
    );
  }
}

UserDashboard.propTypes = {
  location: PropTypes.object,
  state: PropTypes.object,
  username: PropTypes.string
};

export default UserDashboard;
