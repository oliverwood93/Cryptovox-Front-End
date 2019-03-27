import React, { Component, Fragment } from 'react';
import { makeAPICalls } from '../utils/apiCalls';
import '../App.css';
import { Card, Button, CardColumns, Modal } from 'react-bootstrap';
import Mic from '../components/Mic';
import axios from 'axios';
import formatDownload from '../utils/formatDownload';

class WorkspaceFilesList extends Component {
    state = {
        files: [],
        workspaceFilesUpdated: false,
        loading: false,
        selectedFile: null,
        showDecrypt: false,
        notIdentified: false,
        wrongKey: false
    };

    componentDidMount() {
        const { workspace } = this.props;
        this.getWorkspaceFiles( workspace );
    }
    componentDidUpdate( prevProps ) {
        const { workspace } = this.props;
        if ( prevProps.workspace !== workspace ) {
            this.getWorkspaceFiles( workspace );
            this.setState( { notIdentified: false } );
        }
    }
    render() {
        const { files, showDecrypt, notIdentified, wrongKey } = this.state;
        return (
            <Fragment>
                {files.map( singlefile => {
                    return (
                        <div key={singlefile.file_name} className="container">
                            {wrongKey && <Modal show={wrongKey}>
                                <Modal.Dialog>
                                    <Modal.Header />
                                    <Modal.Body>
                                        <p>Wrong Audio Key Used, if you used recorded please try again by uploading the audio file</p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button onClick={() => this.setState({wrongKey: false})}>Close</Button>
                                    </Modal.Footer>
                                </Modal.Dialog>
                            </Modal>        }
                            <Card style={{ width: '30vw' }}>
                                <Card.Title>{singlefile.file_name}</Card.Title>
                                <Card.Body>
                                    <Button
                                        variant="primary"
                                        data-filename={singlefile.file_name}
                                        onClick={e =>
                                            this.setState( {
                                                selectedFile: e.target.dataset.filename,
                                                showDecrypt: !showDecrypt
                                            } )
                                        }
                                    >
                                        Decrypt
                                    </Button>
                                    {showDecrypt && (
                                        <div>
                                            <Mic
                                                decrypt={true}
                                                handleRecordedAudio={this.handleClick}
                                            />
                                            <input
                                                accept="audio/*"
                                                type="file"
                                                onChange={e => this.handleClick( e.target.files[ 0 ] )}
                                            />
                                        </div>
                                    )}
                                    {notIdentified && (
                                        <p>
                                            We have not identified your audio, if this is the
                                            correct file then please upload directly
                                        </p>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    );
                } )}
            </Fragment>
        );
    }
    getWorkspaceFiles = workspace => {
        const apiObj = {
            url: `/workspaces/${ workspace }/files`,
            reqObjectKey: 'files',
            method: 'get'
        };
        makeAPICalls( apiObj )
            .then( files => {
                this.setState( { files, workspaceFilesUpdated: true }, () => {
                    this.props.refreshDone();
                } );
            } )
            .catch( err => {
                this.setState( { users: [], workspaceFilesUpdated: false } );
            } );
    };

    handleClick = audiofile => {
        const { selectedFile } = this.state;
        const { workspace } = this.props;
        const data = new FormData();
        data.append( 'file', audiofile );
        axios
            .post(
                `https://ssc-be.herokuapp.com/api/decryptFile/${ workspace }/${ selectedFile }`,
                data,
                { responseType: 'arraybuffer' }
            )
            .then( ( { data } ) => {
                formatDownload( data, selectedFile );
            } )
            .catch(err =>  this.setState({wrongKey: true}));
    };
}
export default WorkspaceFilesList;
