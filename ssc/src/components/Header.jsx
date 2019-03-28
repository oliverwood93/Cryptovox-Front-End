import React from 'react';
import logo from '../resources/logo.png'
import { Button } from 'react-bootstrap';

export default function Header( { handleLogout } ) {
    
    return (
        <div className="header">
            <img className="logo" src={logo} alt="crytovox logo"/>
            {localStorage.getItem( 'userLoggedIn' ) &&
                <Button variant="danger" id="logout" onClick={handleLogout}>
                    Log out
                </Button>
            }
        </div>
    );
}
