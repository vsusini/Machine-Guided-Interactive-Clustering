import React, { Component } from 'react';
import axios from 'axios';
import Papa from 'papaparse'
import { AppContext, FormInput } from "../../App"

import { Formik, Form } from "formik";
import * as Yup from "yup";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MyTextInput } from "./textInput"

class FileUpload extends Component {

    constructor(props) {
        super(props)
        this.el = React.createRef()
        this.file = null
        this.path = null
        this.name = null
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
                                <div className="file-upload">
                                    <input type="file" ref={this.el} accept=".csv" onChange={handleChange} />
                                    <Formik
                                        initialValues={new FormInput()}
                                        validationSchema={Yup.object({
                                            questionsPerIteration: Yup.number().required(),
                                            numberOfClusters: Yup.number().required()
                                        })}
                                        onSubmit={async values => {
                                            await new Promise(resolve => setTimeout(resolve, 250));
                                            context.testObj = values
                                            console.log("Submitting")
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
                                            <button type="submit" className="upbutton">
                                                Submit Values
                                            </button>
                                        </Form>
                                    </Formik>

                                    <button type="button" onClick={uploadFile} className="upbutton">
                                        Upload
                                    </button>
                                    <button onClick={context.runPython} className="upbutton">
                                        Python
                                    </button>
                                    <hr />
                                    {this.path && <span>{this.path}</span>}
                                    {this.name && <span>{this.name}</span>}
                                </div>
                            </div>
                        );
                    }}
                </AppContext.Consumer>
            </>
        )
    }
}
export default FileUpload;