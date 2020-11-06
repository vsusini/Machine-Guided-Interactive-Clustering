import React, { Component } from 'react';
import { Col, Row, ProgressBar } from 'react-bootstrap';
import { StatNumber } from "./individualStatNumber"

class SquareStatDisplay extends Component {

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
                            Constraints
                            <Row className="lineForStats">
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
                            <Row>
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
                    </Row>
                    <Row>
                        <Col className="text-center mt-3">
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
                    </Row>
                </div>
            </>
        )
    }
}


export default SquareStatDisplay;