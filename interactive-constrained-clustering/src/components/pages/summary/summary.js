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
                            <div className="overflow-auto">
                                <div className="outerBorders rowNoMargin mx-4 mt-3">
                                    <RecStatDisplay stats={context.stats} iterationCount={context.iterationCount}></RecStatDisplay>
                                </div>
                                <div className="rowNoMargin">
                                    <Col className="noXPadding">
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