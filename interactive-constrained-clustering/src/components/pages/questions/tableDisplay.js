import React, { Component } from 'react';
import { Table } from 'react-bootstrap'

class TableDisplay extends Component {


    static instance = TableDisplay
    static getInstance = () => TableDisplay.instance;
    constructor(props) {
        super(props)
        this.dataArr = props.dataArr.data
        this.set = props.set
        this.featuresArr = props.dataArr.data[0]
        this.state = {
            questionIndex: 0,
            sample1: this.getSample(this.dataArr, this.set, 0, 0),
            sample2: this.getSample(this.dataArr, this.set, 1, 0),
        }

        TableDisplay.instance = this;
    }


    increaseIndex = () => {
        this.setState(previousState => {
            return {
                questionIndex: previousState.questionIndex + 2,
                sample1: this.getSample(this.dataArr, this.set, 0, previousState.questionIndex + 2),
                sample2: this.getSample(this.dataArr, this.set, 1, previousState.questionIndex + 2)
            }
        })
    }

    getSample = (arr, set, sample_num, question) => {
        try {
            return arr[set[question + sample_num]]
        } catch (err) {
            return this.featuresArr
        }
    }

    render() {
        return (
            <>
                <Table striped bordered size="sm" className="marginBottom0">
                    <thead>
                        <tr>
                            <th>Features</th>
                            <th>Sample {this.set === undefined ? "" : this.set[this.state.questionIndex]}</th>
                            <th>Sample {this.set === undefined ? "" : this.set[this.state.questionIndex + 1]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.featuresArr.map((key, index) => {
                            return (
                                <tr key={index}>
                                    <td>{key}</td>
                                    <td>{this.state.sample1[index]}</td>
                                    <td>{this.state.sample2[index]}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </>
        )
    }
}


export default TableDisplay;