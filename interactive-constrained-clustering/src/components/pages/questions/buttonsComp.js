import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap'
import TableDisplay from "./tableDisplay"

class ButtonsComponent extends Component {

    constructor(props) {
        super(props)
        this.set = props.set
        this.trackPython = props.python
        this.totalQuestion = props.totalQuestion
        this.mlArr = []
        this.clArr = []
        this.unknown = []
        this.index = 0
        this.state = {
            questionNum: 1
        }
    }

    increaseQuestion = () => {
        this.setState(previousState => {
            return {
                questionNum: previousState.questionNum + 1,
            }
        })
        this.index += 2
    }

    handleMustLink = () => {
        this.mlArr.push(this.set[this.index])
        this.mlArr.push(this.set[this.index+1])
        this.handleClick()
    }

    handleCantLink = () => {
        this.clArr.push(this.set[this.index])
        this.clArr.push(this.set[this.index+1])
        this.handleClick()
    }

    handleUnkown = () => {
        this.unknown.push(this.set[this.index])
        this.unknown.push(this.set[this.index+1])
        this.handleClick()
    }

    

    handleClick = () => {
        this.increaseQuestion()
        if (this.state.questionNum === parseInt(this.totalQuestion)){
            this.trackPython(this.mlArr, this.clArr)
        }
        TableDisplay.getInstance().increaseIndex()
    }




    render() {
        return (
            <>
                <Col>
                    <Row>
                        <Col>
                            Questions {this.state.questionNum} / {this.totalQuestion}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onClick={this.handleMustLink}>Must-Link</Button>
                        </Col>
                        <Col>
                            <Button onClick={this.handleUnkown}>Unknown</Button>
                        </Col>
                        <Col>
                            <Button onClick={this.handleCantLink}>Cannot-Link</Button>
                        </Col>
                    </Row>
                </Col>
            </>
        )
    }
}


export default ButtonsComponent;