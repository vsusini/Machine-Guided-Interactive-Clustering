import React, { Component } from 'react';
import ChartsDisplay from "../../chartsDisplay/chartsDisplay"
import { AppContext } from "../../../App"
import { Col } from 'react-bootstrap';
import RecStatDisplay from "../../statsDisplays/recStatDisplay"

class Summary extends Component {
    render() {
        return (
            <>
                <AppContext.Consumer>
                    {context => {
                        return (
                            <div>
                                <div className="outerBorders rowNoMargin topOuterBorder mx-5">
                                    <RecStatDisplay stats={context.stats} iterationCount={context.iterationCount}></RecStatDisplay>
                                </div>
                                <div className="rowNoMargin">
                                    <Col>
                                        <ChartsDisplay iterationCount={context.iterationCount}></ChartsDisplay>
                                    </Col>
                                </div>
                            </div>
                        )
                    }}
                </AppContext.Consumer>
            </>
        )
    }
}

export default Summary;