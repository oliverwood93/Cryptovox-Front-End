import React from "react";
import PropTypes from "prop-types";
import { Form, Button, ListGroup } from "react-bootstrap";

const WorkspaceUserAdder = ({
  handleAddUser,
  handleNewUserChange,
  newUser,
  filteredUsers,
  handleItemClick
}) => {
  const croppedList = filteredUsers.slice(0, 5);
  return (
    <Form onSubmit={handleAddUser} className="user-add-container">
      <Form.Group controlId="formBasicUserName">
        <Form.Control
        className="user-adder-form"
          type="text"
          value={newUser}
          placeholder="Enter new User to add"
          onChange={handleNewUserChange}
          autoComplete="off"
        />
        {newUser !== "" && (
          <ListGroup>
            {croppedList.map(user => {
              return (
                <ListGroup.Item key={user.username} onClick={handleItemClick}>
                  {user.username}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Form.Group>
      <Button
        className="addButton"
        variant="primary"
        type="submit"
        disabled={newUser === ""}
      >
        Add
      </Button>
    </Form>
  );
};

WorkspaceUserAdder.propTypes = {
  handleAddUser: PropTypes.func,
  handleItemClick: PropTypes.func,
  handleNewUserChange: PropTypes.func,
  newUser: PropTypes.string,
  filteredUsers: PropTypes.array
};
export default WorkspaceUserAdder;
