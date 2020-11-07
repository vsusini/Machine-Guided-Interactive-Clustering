import React, { Component } from 'react';
import { Col, Row, ProgressBar, Button } from 'react-bootstrap';
import { StatNumber } from "./individualStatNumber"

class RecStatDisplay extends Component {

    constructor(props) {
        super(props)
        this.state = {
            stats: props.stats
        }
    }

    render() {
        return (
            <>
                <div className="containerNoPadding">
                    <Row>
                        <Col className="text-center">
                            Constraint Percentage
                            <Row>
                                <Col>
                                    <Row>
                                        <Col className="my-3">
                                            <ProgressBar striped animated variant="primary" label={`${this.state.stats.constrainedPercent}%`} now={this.state.stats.constrainedPercent} />
                                        </Col>
                                    </Row>
                                    <Row className="ml-5">
                                        <Col xs={5}>
                                            <Row>
                                                <Col>
                                                    <span>{this.state.stats.maxConstraint}%</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <span className="individTitleForStats">Max Constraint Percent</span>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={5}>
                                            <Row>
                                                <Col>
                                                    <span>{this.state.stats.totalConstraints}/{this.state.stats.possibleConstraints}</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <span className="individTitleForStats">Constraints Possible Overall</span>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="text-center">
                            Constraints
                            <Row className="lineForStats mt-1">
                                <Col xs={4}>
                                    <StatNumber number={this.state.stats.mlConstraintCount} name="Must Link Constraints"></StatNumber>
                                </Col>
                                <Col xs={4}>
                                    <StatNumber number={this.state.stats.unknownConstraintCount} name="Unknown Constraints"></StatNumber>
                                </Col>
                                <Col xs={4}>
                                    <StatNumber number={this.state.stats.clConstraintCount} name="Can't Link Constraints"></StatNumber>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="text-center">
                            Title
                            <Row className="mt-1">
                                <Col xs={4}>
                                    <StatNumber number={this.state.stats.clConstraintCount} name="Sihloutte Average"></StatNumber>
                                </Col>
                                <Col xs={4}>
                                    <StatNumber number={this.state.stats.clConstraintCount} name="Sihloutte Min"></StatNumber>
                                </Col>
                                <Col xs={4}>
                                    <StatNumber number={this.state.stats.clConstraintCount} name="Sihloutte"></StatNumber>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={2} className="text-center">
                            Options
                            <Row>
                                <Col>
                                    <a className="fixLinkOverButtonHover" href={require("../../model/finalized_model.sav").default} download="model.sav">
                                        <Button className="btn-block mb-3 mt-2">
                                            Export Model
                                        </Button>
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col>

                                <a className="fixLinkOverButtonHover" href={require("../../images/clusterImg1.png").default} download="images">
                                        <Button className="btn-block mb-3 mt-2">
                                            Download Images
                                        </Button>
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </>
        )
    }
}


export default RecStatDisplay;