import React, { Component } from 'react';
import { makeAPICalls } from '../utils/apiCalls';
import { Dropdown, Alert } from 'react-bootstrap';

class PendingInvites extends Component {
  state = {
      invites: [],
      isClicked: false
  };
  render() {
      const { invites } = this.state;

      return (
          <div className="invitesDiv">
              {invites.length > 0 
                  ? <Dropdown>
                      <Dropdown.Toggle className="invitesList" variant="warning" id="dropdown-custom-1">View Invites</Dropdown.Toggle>
                      <Dropdown.Menu>
                          {invites && invites.map( invite => {
                              return <Dropdown.Item key={invite.workspace} eventKey={invite.workspace}>{invite.invited_by} added you to {invite.workspace}</Dropdown.Item>;
                          } )
                          }            
                      </Dropdown.Menu>
                  </Dropdown>
                  : <Alert variant="primary">No pending invites</Alert>
              }
          </div>
      );
  }
  componentDidMount() {
      this.fetchInvites();
  }
  fetchInvites = () => {
      const { username } = this.props;

      const apiObj = {
          url: `/invites/${ username }`,
          reqObjectKey: 'invites',
          method: 'get'
      };
      makeAPICalls( apiObj )
          .then( ( invites ) => {
              this.setState( { invites } );                
          } )
          .catch( ( err ) => {
              this.setState( { invites: [] } ); 
          } );
  };

}

export default PendingInvites;
