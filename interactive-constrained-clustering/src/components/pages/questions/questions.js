import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Questions extends Component {
    constructor(props) {
        super(props)
        this.iteration = 2
    }
    render() {
        return (
            <div>
                <Link to="/summary"><button>Finish</button></Link>
            </div>
        );
    }
}

export default Questions;