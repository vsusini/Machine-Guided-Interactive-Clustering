import React from 'react';
import { Link } from "react-router-dom";
import { Col, Row, Button } from 'react-bootstrap';
import { ChartSlot } from '../../chartsDisplay/singleChartDisplay'
import { AppContext } from "../../../App"
import { ModalChartDisplay } from "../../chartsDisplay/modalChartDisplay"
import TableDisplay from "./tableDisplay"
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-promise-loader';

export const Questions = (props) => {
    const { promiseInProgress } = usePromiseTracker()
    return (
        <>
            {
                // console.log("Promse"+promiseInProgress)
                (promiseInProgress === true) ?
                    <Loader promiseTracker={usePromiseTracker} />
                    :
                    <AppContext.Consumer>
                        {context => (
                            <div className="mx-4">
                                <div className="outerBorders rowNoMargin topOuterBorder imageViewOptions">
                                    <Col>

                                    </Col>
                                    <Col xs={3}>
                                        <ChartSlot
                                            iteration={context.iterationCount}
                                            imgSrc={require("../../../images/clusterImg" + context.iterationCount + ".png").default}>
                                        </ChartSlot>
                                    </Col>
                                    <Col>
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
                                <div className="rowNoMargin lowerViewOptions">
                                    <Col className="outerBorders marginLeft0">
                                        {/* <TableDisplay dataArr={context.dataArr} set={[1, 2, 3, 4]}></TableDisplay> */}
                                        {/* For when the loading is implemented */}
                                        <TableDisplay dataArr={context.dataArr} set={context.output.question_set}></TableDisplay>
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
                                                        <Button onClick={() => TableDisplay.getInstance().increaseIndex()}>Must-Link</Button>
                                                    </Col>
                                                    <Col>
                                                        <Button>Unknown</Button>
                                                    </Col>
                                                    <Col>
                                                        <Button>Cannot-Link</Button>
                                                    </Col>
                                                    <Button onClick={() => context.trackPython(2, 10, 2)}>Run Python</Button>
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
            }
        </>
    );
}