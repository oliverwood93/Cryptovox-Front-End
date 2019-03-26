import React from "react";
import PropTypes from "prop-types";
import Workspaces from "./Workspaces";
import PendingInvites from "./PendingInvites";

const UserDashboard = ({
  location: {
    state: { username }
  }
}) => {
  return (
    <div>
      <h1>Hello {username}</h1>
      <PendingInvites username={username} />
      <Workspaces username={username} />
    </div>
  );
};

UserDashboard.propTypes = {
  location: PropTypes.object,
  state: PropTypes.object,
  username: PropTypes.string
};

export default UserDashboard;
