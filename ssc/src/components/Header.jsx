import React from 'react';

export default function Header( props ) {
    // eslint-disable-next-line react/prop-types
    const { username, handleLogout } = props;
    return (
        <div className="header">
            <h1>SecureSoniCryptor (SSC)</h1>
            {username !== null && (
                <button id="logout" onClick={handleLogout}>
                    Log out
                </button>
            )}
        </div>
    );
}
