import React from 'react';
import Card from 'react-bootstrap/Card';

export default function AudioFileUpload( { audioSelectedHandler } ) {
    return (
        <Card className="audio-upload-section">
            <input accept="audio/*" type="file" onInput={audioSelectedHandler} />
        </Card>
    );
}
