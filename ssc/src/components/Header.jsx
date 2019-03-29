import React from 'react';
import logo from '../resources/logo.png';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default function Header({ handleLogout, username }) {
    return (
        <div className={username ? 'header' : 'logged-out-header'}>
            {username && (
                <Alert className="signed-in-display" variant="success">
                    Signed-In: {username}
                </Alert>
            )}

            <img className={username ? 'logo' : 'logged-out-logo'} src={logo} alt="crytovox logo" />
            {localStorage.getItem('userLoggedIn') && (
                <Button variant="danger" id="logout" onClick={handleLogout}>
                    Log out
                </Button>
            )}
        </div>
    );
}
