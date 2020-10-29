import FileUpload from './inputForm/inputForm';
import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

class Landing extends Component {

    render() {
        return (
            <section className="imgSection">
                <div className="rowNoMargin">
                    <Col className="col-sm-6 align-middle align-items-center text-center">
                        <h2>Interactive Constrained Clustering</h2>
                    </Col>
                    <Col className="col-sm-6 p-5">
                        <FileUpload></FileUpload>
                    </Col>
                </div>
            </section>
        );
    }
}

export default Landing;