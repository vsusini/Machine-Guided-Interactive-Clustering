import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import Router from './components/router'
import 'bootstrap/dist/css/bootstrap.min.css';
import { trackPromise } from 'react-promise-tracker';
import { Stats, PythonOutput } from './Python'

export const AppContext = React.createContext({
  dataArr: null,
  iterationCount: null,
  formInput: null,
  inputVerified: null,
  pythonPass: null,
  output: PythonOutput,
  stats: Stats,
  saveData: () => { },
  trackPython: () => { },
  saveForm: () => { },
  verifiedInput: () => { },
  pythonRestart: () => { }
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataArr: null,
      iterationCount: 0, //default = 0
      formInput: null,
      inputVerified: false,
      pythonPass: true,
      output: "",
      stats: "",
      saveData: this.saveData,
      trackPython: this.trackPython,
      saveForm: this.saveForm,
      verifiedInput: this.verifiedInput,
      pythonRestart: this.pythonRestart
    };
  }

  trackPython = (ml, cl, unknown) => {
    trackPromise(
      this.runPython(ml, cl, unknown)
    )
  }

  runPython = (ml, cl, unknown) => {
    const promise = new Promise((resolve) => {
      const formData = new FormData();
      formData.append('filename', this.state.formInput.filename)
      formData.append('interation_num', this.state.iterationCount + 1);
      this.setState({ iterationCount: this.state.iterationCount + 1 })
      // formData.append('question_num', this.state.formInput.numberOfClusters)
      // formData.append('cluster_num', this.state.formInput.cluster_num)
      formData.append('question_num', 10)
      formData.append('cluster_num', 2)
      let totalML = this.state.formInput.ml.concat(ml)
      let totalCL = this.state.formInput.cl.concat(cl)
      let unknownCL = this.state.formInput.unknown.concat(unknown)
      formData.append('ml', totalML)
      formData.append('cl', totalCL)
      this.setState({
        formInput: {
          ...this.state.formInput,
          ml: totalML,
          cl: totalCL,
          unknown: unknownCL
        }
      });
      resolve(
        axios.post('http://localhost:4500/python', formData, {
        }).then(res => {
          var outputsFromPython = res.data.name
          var formState = this.state.formInput
          var outputArr = outputsFromPython.split("SEPERATOR")
          this.setState({ stats: new Stats(formState.cl.length, formState.ml.length, formState.unknown.length, formState.maxConstraintPercent, this.state.dataArr.data.length, outputArr[1], outputArr[2], outputArr[0]) })
          this.setState({ output: new PythonOutput(outputArr[3].trim()) })
        }).catch(err => {
          this.setState({ pythonPass: false })
          alert("An error has occured while processing Python. Maybe try with a different dataset? I will restart the tool for you.")
        })
      )
    });
    return promise;
  }

  saveData = (e) => {
    this.setState({ dataArr: e })
  }

  verifiedInput = () => {
    this.setState({ inputVerified: true })
  }

  pythonRestart = () => {
    this.setState({ iterationCount: 0 })
    this.setState({ pythonPass: true })
  }

  saveForm = (e) => {
    this.setState({ formInput: e })
  }

  render() {
    return (
      <div className="App">
        <AppContext.Provider value={this.state}>
          <Router></Router>
        </AppContext.Provider>
      </div>
    );
  }
}

export default App;
