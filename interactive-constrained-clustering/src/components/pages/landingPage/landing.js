import FileUpload from './inputForm/inputForm';
import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

class Landing extends Component {

    render() {
        return (
            <div className="rowNoMargin imgSection">
                <Col className="col-sm-6 align-middle align-items-center text-center leftHalf">
                    <h1 className="text-white titleFontSize">Interactive Constrained Clustering</h1>
                </Col>
                <Col className="col-sm-6 align-middle align-items-center">
                    <FileUpload></FileUpload>
                </Col>
            </div>
        );
    }
}

export default Landing;