import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Col, Row, Button } from 'react-bootstrap';
import { ChartSlot } from '../../chartsDisplay/singleChartDisplay'
import { AppContext } from "../../../App"
import { ModalChartDisplay } from "../../chartsDisplay/modalChartDisplay"

class Questions extends Component {
    render() {
        return (
            <>
                <AppContext.Consumer>
                    {context => (
                        <div className="mx-5">
                            <div className="outerBorders rowNoMargin topOuterBorder">
                                <Col>

                                </Col>
                                <Col xs={6}>
                                    <ChartSlot
                                        iteration={context.iterationCount}
                                        imgSrc={require("../../../images/clusterImg" + context.iterationCount + ".png").default}>
                                    </ChartSlot>
                                </Col>
                                <Col className="">
                                    <Row>
                                        Options
                                    </Row>
                                    <Row>

                                        <Link to="/summary"><Button variant="danger">Finish</Button></Link>
                                    </Row>
                                    <Row>
                                        <ModalChartDisplay></ModalChartDisplay>
                                    </Row>
                                </Col>
                            </div>
                            <div className="rowNoMargin">
                                <Col className="outerBorders">

                                </Col>
                                <Col className="">
                                    <Row className="outerBorders">
                                        <Col>
                                            <Row>
                                                <Col>
                                                    Questions
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Button>Must-Link</Button>
                                                </Col>
                                                <Col>
                                                    <Button>Unknown</Button>
                                                </Col>
                                                <Col>
                                                    <Button>Cannot-Link</Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="outerBorders">

                                    </Row>
                                </Col>
                            </div>
                        </div>

                    )}
                </AppContext.Consumer>
            </>
        );
    }
}

export default Questions;