import React, { Component } from 'react';
import { Col, Row, ProgressBar, Button } from 'react-bootstrap';
import { StatNumber } from "./individualStatNumber"
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver';

class RecStatDisplay extends Component {

    constructor(props) {
        super(props)
        this.iterationCount = props.iterationCount
        this.state = {
            stats: props.stats
        }
    }

    zipImagesFolderAndDownload = () => {
        var zip = new JSZip();
        var imageArr = []
        for (let index = 0; index < this.iterationCount; index++) {
            imageArr.push(require("../../images/clusterImg" + (index + 1) + ".png").default)
        }
        Promise.all(imageArr.map(function (url) {
            return new Promise(function (resolve, reject) {
                JSZipUtils.getBinaryContent(url, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(url)
                        zip.file(url.split("/")[3], data);
                        resolve();
                    }
                });
            })
        })).then(function () {
            zip.generateAsync({
                type: "blob"
            }).then(function (content) {
                saveAs(content, "images.zip")
            });
        })
    }

    render() {
        return (
            <>
                <div className="containerNoPadding">
                    <Row>
                        <Col className="text-center">
                            Constrained Percentage
                            <Row>
                                <Col>
                                    <Row>
                                        <Col className="my-3">
                                            <ProgressBar striped animated variant="primary" label={`${this.state.stats.constrainedPercent}%`} now={this.state.stats.constrainedPercent} />
                                        </Col>
                                    </Row>
                                    <Row className="">
                                        <Col xs={4}>
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
                                        <Col xs={4}>
                                            <Row>
                                                <Col>
                                                    <span>{this.state.stats.totalConstraints}/{this.state.stats.possibleConstraints}</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <span className="individTitleForStats">Total Constraints Possible</span>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={4}>
                                            <Row>
                                                <Col>
                                                    <span>{this.state.stats.constraintsLeft}</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <span className="individTitleForStats">Constraints Left</span>
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
                            Silhouette
                            <Row className="mt-1">
                                <Col xs={4}>
                                    <StatNumber number={this.state.stats.silMin} name="Silhouette Minimum"></StatNumber>
                                </Col>
                                <Col xs={4}>
                                    <StatNumber number={this.state.stats.silAvg} name="Silhouette Average"></StatNumber>
                                </Col>
                                <Col xs={4}>
                                    <StatNumber number={this.state.stats.silMax} name="Silhouette Maximum"></StatNumber>
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
                                    <Button className="btn-block mb-3 mt-2" onClick={this.zipImagesFolderAndDownload}>
                                        Download Images
                                    </Button>
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