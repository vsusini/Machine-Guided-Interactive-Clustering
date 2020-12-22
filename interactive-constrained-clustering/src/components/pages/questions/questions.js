import React from 'react';
import { Link } from "react-router-dom";
import { Col, Row, Button } from 'react-bootstrap';
import { ChartSlot } from '../../chartsDisplay/singleChartDisplay'
import { AppContext } from "../../../App"
import { ModalChartDisplay } from "../../chartsDisplay/modalChartDisplay"
import TableDisplay from "./tableDisplay"
import ButtonsComponent from "./buttonsComp"
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-promise-loader';
import SquareStatDisplay from '../../statsDisplays/squareStatDisplay'

export const Questions = () => {
    const { promiseInProgress } = usePromiseTracker()
    function handleImagePassing(count) {
        try {
            return require("../../../images/clusterImg" + count + ".png").default
        } catch (error) {
            console.log("Image Error")
        }
    }
    return (
        <>
            {
                (promiseInProgress === true) ?
                    <div>
                        {/* <span className="align-middle align-items-center h-90vh">Loading...</span> */}
                        <Loader promiseTracker={usePromiseTracker} />
                    </div>
                    :
                    <AppContext.Consumer>
                        {context => (
                            <div className="mx-4 overflow-auto">
                                <div className="outerBorders rowNoMargin topOuterBorder">
                                    <Col>

                                    </Col>
                                    <Col xs={3}>
                                        <ChartSlot
                                            iteration={context.iterationCount}
                                            // imgSrc={"../../images/clusterImg" + context.iterationCount + ".png"}>
                                            imgSrc={handleImagePassing(context.iterationCount)}>
                                        </ChartSlot>
                                    </Col>
                                    <Col>
                                        <Row>

                                            <Col>
                                            </Col>
                                            <Col className="text-center">
                                                Options
                                                <Row>
                                                    <Col>
                                                        <Link className="fixLinkOverButtonHover" to="/summary"><Button className="btn-block mb-3 mt-2" variant="danger">Finish</Button></Link>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <ModalChartDisplay></ModalChartDisplay>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                        </Row>
                                        <Row>
                                        </Row>
                                    </Col>
                                </div>
                                <div className="rowNoMargin">
                                    <Col className="outerBorders marginLeft0 lign-middle align-items-center">
                                        <TableDisplay dataArr={context.dataArr} set={context.output.question_set}></TableDisplay>
                                    </Col>
                                    <Col className="">
                                        <Row className="outerBordersNoneRight">
                                            <ButtonsComponent set={context.output.question_set} python={context.trackPython} totalQuestion={context.formInput.questionsPerIteration} totalPercent={context.stats.constrainedPercent} pythonPass={context.pythonPass}></ButtonsComponent>
                                        </Row>
                                        <Row className="outerBordersNoneRight">
                                            <SquareStatDisplay stats={context.stats}></SquareStatDisplay>
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