import FileUpload from './inputForm/inputForm';
import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import Notification from '../../notification'
import { AppContext } from "../../../App"

class Landing extends Component {

    render() {
        return (
            <>
                <AppContext.Consumer>
                    {context => (
                        <>
                            <Notification text={context.errorMessage} show={context.error} />
                            <div className="rowNoMargin imgSection">
                                <Col className="col-sm-6 align-middle align-items-center text-center leftHalf">
                                    <h1 className="text-white titleFontSize">Interactive Constrained Clustering</h1>
                                </Col>
                                <Col className="col-sm-6 align-middle align-items-center">
                                    <FileUpload></FileUpload>
                                </Col>
                            </div>
                        </>
                    )}
                </AppContext.Consumer>
            </>
        );
    }
}

export default Landing;