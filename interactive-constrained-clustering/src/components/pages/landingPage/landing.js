import FileUpload from './inputForm/inputForm';
import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

class Landing extends Component {

    render() {
        return (
            <section className="imgSection">
                <div className="rowNoMargin h-100">
                    <Col className="col-sm-6 align-middle align-items-center text-center">
                        <h1>Interactive Constrained Clustering</h1>
                    </Col>
                    <Col className="col-sm-6 align-middle align-items-center">
                        <FileUpload></FileUpload>
                    </Col>
                </div>
            </section>
        );
    }
}

export default Landing;