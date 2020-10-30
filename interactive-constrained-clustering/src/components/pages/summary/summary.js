import React, { Component } from 'react';
import ChartsDisplay from "../../chartsDisplay/chartsDisplay"
import { AppContext } from "../../../App"
import { Col, Button } from 'react-bootstrap';

class Summary extends Component {
    render() {
        return (
            <>
                <AppContext.Consumer>
                    {context => {
                        return (
                            <div>
                                <div className="outerBorders rowNoMargin topOuterBorder mx-5">
                                    <h1>Summary</h1>
                                    <Button>Refresh</Button>
                                    <Button>Export Model</Button>
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