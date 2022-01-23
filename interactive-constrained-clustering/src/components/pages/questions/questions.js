import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Col, Row, Button } from 'react-bootstrap';
import { ChartSlot } from '../../chartsDisplay/singleChartDisplay'
import App, { AppContext } from "../../../App"
import { ModalChartDisplay } from "../../chartsDisplay/modalChartDisplay"
import TableDisplay from "./tableDisplay"
import ButtonsComponent from "./buttonsComp"
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-promise-loader';
import SquareStatDisplay from '../../statsDisplays/squareStatDisplay'
import Notification from '../../notification'
import { useEffect } from 'react';
import axios from 'axios';


export const Questions = () => {
    const { promiseInProgress } = usePromiseTracker()
    const yolo = React.useContext(AppContext);

    function handleImagePassing(count) {
        try {
            return require("../../../images/clusterImg" + count + ".png").default
        } catch (error) {
            console.log("Image Error")
        }
    }

    function updateDropDowns(){

        var select = document.getElementById("xaxis");
        select.innerHTML = "";
        var options = yolo.columns;

        for(var i = 0; i < options.length; i++) {
            var opt = options[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        select = document.getElementById("yaxis");
        select.innerHTML = "";

        for(i = 0; i < options.length; i++) {
            opt = options[i];
            el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        console.log("DDDEREFKDSF")
    }

    function updateAxes(){
        var x = document.getElementById("xaxis")
        var y = document.getElementById("yaxis")

        console.log(yolo.columns.indexOf(x.value))
        console.log(yolo.columns.indexOf(y.value))

        updateImage(yolo.columns.indexOf(x.value), yolo.columns.indexOf(y.value))
    }

    function updateImage(x, y){
        const formData = new FormData();

        formData.append('iter', yolo.iterationCount)
        formData.append('xaxis', x)
        formData.append('yaxis', y)

        axios.post("http://localhost:4500" + '/python/image', formData, {
        }).then(res => {
          console.log("beans")
          
        }).catch(_ => {
          console.log("not beans")
        })

        //updateDropDowns();
    }
    
    useEffect(() => {
        updateImage()
        
    },[]);

    return (
        <>
            {
                (promiseInProgress === true) ?
                    <div>
                        {/* <span className="align-middle align-items-center h-90vh">Loading...</span> */}
                        <Loader promiseTracker={usePromiseTracker} />
                    </div>
                    :
                    <AppContext.Consumer>
                        {context => (
                            <div className="mx-4 overflow-auto">
                                <Notification text={context.notifMessage} show={context.error} type="" />
                                <Notification text={context.notifMessage} show={context.warning} type="warning" func={context.changeClusterNum} />
                                <div className="outerBorders rowNoMargin topOuterBorder">
                                    <Col>
                                        <Row>
                                            <Col>
                                            </Col>
                                            <Col className="text-center">
                                                Chart Options
                                                <Row>
                                                    <Col>
                                                        <label for="X">Choose X axis variable:</label>
                                                        <select name="xaxis" id="xaxis" onChange={updateAxes}>
                                                        </select>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <label for="Y">Choose Y axis variable:</label>
                                                        <select name="yaxis" id="yaxis" onChange={updateAxes}>
                                                        </select>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={3}>
                                        <ChartSlot
                                            iteration={context.iterationCount}
                                            // imgSrc={"../../images/clusterImg" + context.iterationCount + ".png"}>
                                            imgSrc={handleImagePassing(context.iterationCount)}>
                                        </ChartSlot>
                                    </Col>
                                    <Col>
                                        <Row>

                                            <Col>
                                            </Col>
                                            <Col className="text-center">
                                                Options
                                                <Row>
                                                    <Col>
                                                        <Link className="fixLinkOverButtonHover" to="/summary"><Button className="btn-block mb-3 mt-2" variant="danger">Finish</Button></Link>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <ModalChartDisplay></ModalChartDisplay>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                        </Row>
                                        <Row>
                                        </Row>
                                    </Col>
                                </div>
                                <div className="rowNoMargin">
                                    <Col className="outerBorders marginLeft0 lign-middle align-items-center">
                                        <TableDisplay dataArr={context.dataArr} set={context.output.question_set}></TableDisplay>
                                    </Col>
                                    <Col className="">
                                        <Row className="outerBordersNoneRight">
                                            <ButtonsComponent set={context.output.question_set} python={context.trackPython} totalQuestion={context.formInput.questionsPerIteration} totalPercent={context.stats.constrainedPercent} pythonPass={context.pythonPass}></ButtonsComponent>
                                        </Row>
                                        <Row className="outerBordersNoneRight">
                                            <SquareStatDisplay stats={context.stats}></SquareStatDisplay>
                                        </Row>
                                    </Col>
                                </div>
                            </div>

                        )}
                    </AppContext.Consumer>
            }
        </>
    );
}