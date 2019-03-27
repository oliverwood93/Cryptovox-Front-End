import React, { Fragment } from 'react';
import Card from 'react-bootstrap/Card'

export default function AudioFileUpload( {
    audioSelectedHandler,
    trackInfo,
    notRecognised,
    fileError,
    isRecorded
} ) {
    return (
        <Card className="audio-upload-section">
            
            <input accept="audio/*" type="file" onInput={audioSelectedHandler} />
            {trackInfo && !isRecorded &&(
                <Fragment>
                    <p>
                        we recognised the track as {trackInfo.title} by {trackInfo.artist}
                    </p>
                </Fragment>
            )}
            {notRecognised && !trackInfo && (
                <Fragment>
                    <p>
                        We have not recognised this audio, if you wish to still use this audio file then please proceed.
                    </p>
                </Fragment>
            )}
            {fileError && (
                <Fragment>
                    <p>There has been an error with your file, please use a different audio file</p>
                </Fragment>
            )}
        </Card>
    );
}
