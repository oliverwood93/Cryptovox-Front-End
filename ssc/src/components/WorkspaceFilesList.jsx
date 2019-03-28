import React, { Component, Fragment } from 'react';
import { makeAPICalls } from '../utils/apiCalls';
import '../App.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup'
import Alert from 'react-bootstrap/Alert'
import Mic from '../components/Mic';
import axios from 'axios';
import formatDownload from '../utils/formatDownload';
import fileIcon from '../resources/file.png';

class WorkspaceFilesList extends Component {
    state = {
        files: [],
        workspaceFilesUpdated: false,
        loading: false,
        selectedFile: null,
        showDecrypt: false,
        notIdentified: false,
        wrongKey: false,
        didMount: false
    };

    componentDidMount() {
        const { workspace } = this.props;
        this.getWorkspaceFiles(workspace);
        this.setState({ didMount: true });
    }
    componentDidUpdate(prevProps) {
        const { workspace } = this.props;
        if (prevProps.workspace !== workspace) {
            this.getWorkspaceFiles(workspace);
            this.setState({ notIdentified: false });
        }
    }
    render() {
        const { files, showDecrypt, notIdentified, wrongKey, selectedFile, didMount } = this.state;
        return (
            <ListGroup className="container">
                {files.length === 0 && didMount && (
                    <Alert className="no-files" variant="warning">
                        There are currently no files in this workspace
                    </Alert>
                )}
                {files.map(singlefile => {
                    return (
                        <ListGroup.Item className="file-item" key={singlefile.file_name}>
                            <img className="file-icon" src={fileIcon} alt="file" />
                            <p className="file-name">{singlefile.file_name}</p>
                            <p className="file-type">Type: .{singlefile.file_name.slice(-3)}</p>
                            <Button
                                className="decrypt-btn"
                                variant="primary"
                                data-filename={singlefile.file_name}
                                onClick={e =>
                                    this.setState({
                                        selectedFile: e.target.dataset.filename,
                                        showDecrypt: !showDecrypt
                                    })
                                }
                            >
                                Decrypt
                            </Button>
                            {showDecrypt && selectedFile === singlefile.file_name && (
                                <Fragment>
                                    <Mic
                                        className="mic-decrypt"
                                        decrypt={true}
                                        handleRecordedAudio={this.handleClick}
                                    />
                                    <input
                                        className="upload-decrypt"
                                        id="audio-file-decrypt"
                                        accept="audio/*"
                                        type="file"
                                        onChange={e => this.handleClick(e.target.files[0])}
                                    />
                                </Fragment>
                            )}
                            {notIdentified && (
                                <p>
                                    We have not identified your audio, if this is the correct file
                                    then please upload directly
                                </p>
                            )}

                            {wrongKey && (
                                <Modal show={wrongKey}>
                                    <Modal.Dialog>
                                        <Modal.Body>
                                            <p>
                                                Incorrect Audio Key Used, if you believe this to be
                                                a mistake then please try by uploading the audio
                                                file if you haven't already done so.
                                            </p>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button
                                                onClick={() => this.setState({ wrongKey: false })}
                                            >
                                                Close
                                            </Button>
                                        </Modal.Footer>
                                    </Modal.Dialog>
                                </Modal>
                            )}
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        );
    }
    getWorkspaceFiles = workspace => {
        const apiObj = {
            url: `/workspaces/${workspace}/files`,
            reqObjectKey: 'files',
            method: 'get'
        };
        makeAPICalls(apiObj)
            .then(files => {
                this.setState({ files, workspaceFilesUpdated: true }, () => {
                    this.props.refreshDone();
                });
            })
            .catch(err => {
                this.setState({ users: [], workspaceFilesUpdated: false });
            });
    };

    handleClick = audiofile => {
        const { selectedFile } = this.state;
        const { workspace } = this.props;
        const data = new FormData();
        data.append('file', audiofile);
        axios
            .post(
                `https://ssc-be.herokuapp.com/api/decryptFile/${workspace}/${selectedFile}`,
                data,
                { responseType: 'arraybuffer' }
            )
            .then(({ data }) => {
                formatDownload(data, selectedFile);
            })
            .catch(err => this.setState({ wrongKey: true }));
    };
}
export default WorkspaceFilesList;
