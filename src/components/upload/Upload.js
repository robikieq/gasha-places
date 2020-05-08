import React, { Component } from 'react'
import DropZone from '../dropzone/DropZone';
import './Upload.css';

export class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };

        this.onFilesAdded = this.onFilesAdded.bind(this);
    }

    onFilesAdded(files) {
        this.setState({files: files});
        this.props.onFilesUpload(files);
    }

    render() {
        return (
            <div>
                <DropZone
                    onFilesAdded={this.onFilesAdded} />

                <div className="Files">
                    {this.state.files.map(file => {
                        return (
                            <div key={file.name} className="Row">
                                <span className="Filename">{file.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }
}

export default Upload;
