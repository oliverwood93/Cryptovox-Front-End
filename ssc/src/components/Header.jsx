import React from 'react';

export default function Header( { handleLogout } ) {
    
    return (
        <div className="header">
            <h1>SecureSoniCryptor (SSC)</h1>
            {localStorage.getItem( 'userLoggedIn' ) &&
                <button id="logout" onClick={handleLogout}>
                    Log out
                </button>
            }
        </div>
    );
}
