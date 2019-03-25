import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DashboardHeader extends Component {    

    render () {
        const { username } = this.props;
        return (
            <div>
                <h1>Hello {username}</h1>
            </div>
        );
    }    
}

DashboardHeader.propTypes = {
    username: PropTypes.string
};

export default DashboardHeader;