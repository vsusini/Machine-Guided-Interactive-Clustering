import React, { Component } from 'react';
import axios from 'axios';
import Papa from 'papaparse'
import { AppContext, FormInput } from "../../../../App"
import { withRouter } from 'react-router-dom'
import { Formik, Form } from "formik";
import * as Yup from "yup";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Card, Button } from 'react-bootstrap';

import { MyTextInput } from "./textInput"

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
                            axios.post('http://localhost:4500/upload', formData, {
                            }).then(res => {
                                console.log(res);
                                this.name = res.data.name
                                this.path = 'http://localhost:4500' + res.data.path
                            }).catch(err => console.log(err.response))
                        }
                        return (
                            <div>
                                <div>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>Input Your Information</Card.Title>
                                            <Card.Text>
                                                With supporting text below as a natural lead-in to additional content.
                                            </Card.Text>
                                            <div className="input-group">
                                                <div className="custom-file">
                                                    <input type="file" className="custom-file-input" ref={this.el} accept=".csv" onChange={handleChange} />
                                                    <label className="custom-file-label">{this.fileName}</label>
                                                </div>
                                            </div>

                                            <Formik
                                                initialValues={new FormInput()}
                                                validationSchema={Yup.object({
                                                    questionsPerIteration: Yup.number().required(),
                                                    numberOfClusters: Yup.number().required()
                                                })}
                                                onSubmit={async values => {
                                                    const { history } = this.props
                                                    history.push("/questions")
                                                    uploadFile()
                                                    context.testObj = values
                                                    context.runPython(1, 10, 2)
                                                    console.log("Submitting, moving to next page.")
                                                }}
                                            >
                                                <Form>
                                                    <Row>
                                                        <Col>
                                                            <MyTextInput
                                                                label="Questions Per Iteration"
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
                                                    <Button type="submit" className="upbutton">
                                                        Submit Values
                                                    </Button>
                                                </Form>
                                            </Formik>
                                        </Card.Body>
                                    </Card>
                                </div>
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