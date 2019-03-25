import React from "react";
import PropTypes from "prop-types";
import Workspaces from "./Workspaces";
import PendingInvites from "./PendingInvites";

const UserDashboard = ({ username }) => {
  return (
    <div>
      <h1>Hello {username}</h1>
      <PendingInvites username={username} />
      <Workspaces username={username} />
    </div>
  );
};

UserDashboard.propTypes = {
  username: PropTypes.string
};

export default UserDashboard;
