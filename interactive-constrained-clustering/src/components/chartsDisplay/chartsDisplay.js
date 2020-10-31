import React, { Component } from 'react';
import { Col } from 'react-bootstrap'
import { ChartSlot } from "./singleChartDisplay"

class ChartsDisplay extends Component {
    constructor(props) {
        super(props)
        this.iterationCount = props.iterationCount
    }

    getImageArr() {
        var imageArr = [];
        var smallerArray = []
        for (let index = 0; index < this.iterationCount; index++) {
            smallerArray.push(require("../../images/clusterImg" + (index + 1) + ".png").default)
            if (smallerArray.length === 3) {
                imageArr.push(smallerArray)
                smallerArray = []
            }
        }
        if (smallerArray.length) {
            imageArr.push(smallerArray)
        }
        //console.log("ImageArray", imageArr)
        return imageArr
    }

    render() {
        const imageArr = this.getImageArr()
        let realIndex = 0
        return (
            <div>
                {imageArr.map((key, index) => {
                    return (
                        <div className="rowNoMargin" key={index}>
                            {key.map((link) => {
                                realIndex = realIndex + 1
                                return (
                                    <Col key={realIndex}>
                                        <div className="outerBorders">
                                            <ChartSlot
                                                iteration={realIndex}
                                                imgSrc={link}>
                                            </ChartSlot>
                                        </div>
                                    </Col>
                                )
                            })
                            }
                            {realIndex % 3 === 1 ? <Col></Col> : null}
                            {realIndex % 3 === 1 ? <Col></Col> : null}
                            {realIndex % 3 === 2 ? <Col></Col> : null}
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default ChartsDisplay;