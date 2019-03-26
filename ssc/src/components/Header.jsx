import React from 'react';

export default function Header( props ) {
    const { username, handleLogout } = props;
    return (
        <div>
            <h1 className="header">SecureSoniCryptor (SSC)</h1>
            {username !== null && (
                <button className="logout" onClick={handleLogout}>
                    Log out
                </button>
            )}
        </div>
    );
}
