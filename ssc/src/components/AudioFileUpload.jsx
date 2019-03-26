import React, {Fragment} from 'react';

export default function AudioFileUpload( {
    audioSelectedHandler,
    selectedAudioFile,
    audioUploadHandler,
    trackInfo,
    handleAcceptAudio,
    notRecognised,
    fileError,
    recordedNotRecognised
} ) {
    return (
        <div>
        <input accept="audio/*" type="file" onChange={audioSelectedHandler} />
            <button onClick={() => audioUploadHandler(selectedAudioFile)}>Upload Audio</button>
            {trackInfo && (
                <Fragment>
                    <p>
                        we recognised the track as {trackInfo.title} by {trackInfo.artist}
                    </p>
                    <button onClick={handleAcceptAudio}>Approve</button>
                </Fragment>
            )}
            {notRecognised && (
                <Fragment>
                    <p>
                        We have not recognised this audio, if it is custom content and you would
                        like to upload it please click approve
                    </p>
                    <button onClick={handleAcceptAudio}>Approve</button>
                </Fragment>
            )}
            {fileError && (
                <Fragment>
                    <p>There has been an error with your file, please use a different audio file</p>
                </Fragment>
            )}
            {recordedNotRecognised && (
                <Fragment>
                    <p>
                        We have not recognised your recorded audio sample, if this is custom content
                        please upload file directly, otherwise please choose another audio sample
                    </p>
                </Fragment>
            )}
        </div>
    );
}
