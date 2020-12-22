import React, { Component } from 'react';
import axios from 'axios';
import Papa from 'papaparse'
import { AppContext } from "../../../../App"
import { FormInput } from '../../../../Python'
import { withRouter } from 'react-router-dom'
import { Formik, Form } from "formik";
import * as Yup from "yup";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Card, Button } from 'react-bootstrap';

import { MyTextInput, MyTextInputPercent } from "./textInput"

class FileForm extends Component {

    constructor(props) {
        super(props)
        this.el = React.createRef()
        this.file = null
        this.path = null
        this.name = null
        this.fileName = "Choose Dataset"
    }

    render() {
        return (
            <>
                <AppContext.Consumer>
                    {context => {
                        let handleChange = (e) => {
                            var regex = new RegExp("(.*?)(csv)$");
                            if (!(regex.test(this.el.current.value.toLowerCase()))) {
                                this.el.current.value = ""
                                alert('Please select correct file format');
                            } else {
                                this.fileName = this.el.current.value.split("\\")[2]
                                this.file = e.target.files[0]; // accesing file
                                const reader = new FileReader();
                                reader.addEventListener('load', event => {
                                    context.saveData(Papa.parse(event.target.result.trim()))
                                });
                                reader.readAsText(this.file);
                            }
                        }
                        let uploadFile = () => {
                            const formData = new FormData();
                            formData.append('file', this.file); // appending file
                            var baseUrl;
                            if (window.location.origin === "http://localhost:3000"){
                                baseUrl = "http://localhost:4500"
                            } else{
                                baseUrl = window.location.origin
                            }
                            console.log(baseUrl)
                            axios.post(baseUrl + '/upload', formData, {
                            }).then(res => {
                                this.name = res.data.name
                                this.path = baseUrl + res.data.path
                            }).catch(err => console.log(err.response))
                        }
                        return (
                            <div className="outerBorders w-75">
                                <Card className="border border-dark">
                                    <Card.Body>
                                        <Card.Title className="text-center">Input Your Information</Card.Title>
                                        <label className="pt-2">Upload a Numerical Dataset</label>
                                        <div className="input-group">
                                            <div className="custom-file">
                                                <input type="file" className="custom-file-input" ref={this.el} accept=".csv" onChange={handleChange} />
                                                <label className="custom-file-label">{this.fileName}</label>
                                            </div>
                                        </div>

                                        <Formik
                                            initialValues={new FormInput()}
                                            validationSchema={Yup.object({
                                                questionsPerIteration: Yup.number().typeError("Must be a number.").required("Need this value to determine questions I can ask you."),
                                                numberOfClusters: Yup.number().typeError("Must be a number.").required("Need this value to know the cluster amount based on your dataset."),
                                                maxConstraintPercent: Yup.number().typeError("Must be a number.").required("Need this so I can help you stop when you are ready.")
                                            })}
                                            onSubmit={async values => {
                                                values.filename = this.fileName
                                                context.verifiedInput()
                                                if (values.questionsPerIteration % 2 !== 0) {
                                                    values.questionsPerIteration = parseInt(values.questionsPerIteration) - 1
                                                }
                                                context.saveForm(values)
                                                context.trackPython([], [], [])
                                                uploadFile()
                                                const { history } = this.props
                                                history.push("/questions")
                                            }}
                                        >
                                            <Form>
                                                <Row>
                                                    <Col>
                                                        <MyTextInput
                                                            label="Questions per Iteration"
                                                            name="questionsPerIteration"
                                                            placeholder="">
                                                        </MyTextInput>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <MyTextInput
                                                            label="Number of Clusters"
                                                            name="numberOfClusters"
                                                            placeholder="">
                                                        </MyTextInput>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <MyTextInputPercent
                                                            label="Max Constraint Percentage"
                                                            name="maxConstraintPercent"
                                                            placeholder="">
                                                        </MyTextInputPercent>
                                                    </Col>
                                                </Row>
                                                <Row className="align-middle align-items-center text-center">
                                                    <Button type="submit" className="mt-3">Start</Button>
                                                </Row>
                                            </Form>
                                        </Formik>
                                    </Card.Body>
                                </Card>
                            </div>
                        );
                    }}
                </AppContext.Consumer>
            </>
        )
    }
}

const FileUpload = withRouter(FileForm)

export default FileUpload;