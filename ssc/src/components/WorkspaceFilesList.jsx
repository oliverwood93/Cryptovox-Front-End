import React, { Component, Fragment } from 'react';
import { makeAPICalls } from '../utils/apiCalls';
import '../App.css';
import { Card, Button, CardColumns } from 'react-bootstrap';
import Mic from '../components/Mic';
import axios from 'axios';

class WorkspaceFilesList extends Component {
    state = {
        files: [],
        workspaceFilesUpdated: false,
        loading: false,
        selectedFile: null,
        showDecrypt: false,
        notIdentified: false
    };

    componentDidMount() {
        const { workspace } = this.props;
        this.getWorkspaceFiles( workspace );
    }
    render() {
        const { files, showDecrypt, notIdentified } = this.state;
        return (
            <Fragment>
                {files.map( singlefile => {
                    return (
                        <div key={singlefile.file_name} className="container">
                            {/* <li>
                                <h3>{file.file_name}</h3>
                            </li> */}
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
                                            We have not identified your audio, if this is the correct
                                            file then please upload directly
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
        console.log( audiofile );
        const { selectedFile } = this.state;
        const { workspace } = this.props;
        const data = new FormData();
        data.append( 'file', audiofile );

        axios
            .post(
                `https://ssc-be.herokuapp.com/api/decryptFile/${ workspace }/${ selectedFile }`,
                data
            )
            .then( ( { data } ) => {
                if ( data.notIdentified ) this.setState( { notIdentified: true } );
            } ); 
    };
}
export default WorkspaceFilesList;
