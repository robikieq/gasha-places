import React, { Component } from 'react'
import Dropzone from '../dropzone/Dropzone';

export class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
          files: []
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
                <Dropzone
                    onFilesAdded={this.onFilesAdded}
                />
          </div>
        )
    }
}

export default Upload;
