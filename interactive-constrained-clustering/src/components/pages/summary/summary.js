import React, { Component } from 'react';
import { Link } from "react-router-dom";
import ChartsDisplay from "./chartsDisplay/chartsDisplay"
import {AppContext} from "../../../App"

class Summary extends Component {
    render() {
        return (
            <>
                <AppContext.Consumer>
                    {context => {
                        return (
                            <div>
                                <h1>Summary</h1>
                                <Link to="/questions"><button>Questions</button></Link>
                                <ChartsDisplay iterationCount={context.iterationCount}></ChartsDisplay>
                            </div>
                        )
                    }}
                </AppContext.Consumer>
            </>
        )
    }
}

export default Summary;