import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import Router from './components/router'
import 'bootstrap/dist/css/bootstrap.min.css';
import { trackPromise } from 'react-promise-tracker';



export class FormInput {
  filename = ""
  questionsPerIteration = ""
  numberOfClusters = ""
  maxConstraintPercent = ""

}

class PythonOutput {
  question_set = ""

  constructor(question_set) {
    this.question_set = this.convertIncomingSet(question_set)
  }

  convertIncomingSet(set) {
    var new_set = set.substring(1, set.length - 1).split(",")
    new_set.forEach((item, index, arr) => {
      arr[index] = parseInt(item.trim())
    })
    return new_set
  }
}

export const AppContext = React.createContext({
  dataArr: null,
  iterationCount: null,
  formInput: null,
  output: PythonOutput,
  saveData: () => { },
  trackPython: () => { },
  saveForm: () => { }
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataArr: null,
      iterationCount: 0, //default = 0
      formInput: null,
      output: "",
      saveData: this.saveData,
      trackPython: this.trackPython,
      saveForm: this.saveForm
    };
  }

  trackPython = (ml,cl) => {
    trackPromise(
      this.runPython(ml,cl)
    )
  }

  runPython = (ml,cl) => {
    const promise = new Promise((resolve, reject) => {
      this.setState({ iterationCount: this.state.iterationCount + 1 })
      const formData = new FormData();
      formData.append('filename', this.state.formInput.filename)
      formData.append('interation_num', this.state.iterationCount);
      // formData.append('question_num', this.state.formInput.numberOfClusters)
      // formData.append('cluster_num', this.state.formInput.cluster_num)
      formData.append('question_num', 10)
      formData.append('cluster_num', 2)
      formData.append('ml', ml)
      formData.append('cl', cl)
      resolve(
        axios.post('http://localhost:4500/python', formData, {
        }).then(res => {
          var outputsFromPython = res.data.name
          //If no SEPERATOR, gives entire output. Else, will seperate the diff parts into an array. Can handle when necessary.
          this.setState({ output: new PythonOutput(outputsFromPython.split("SEPERATOR")[0].trim()) })
        }).catch(err => {
          console.log(err)
          alert("An error has occured, sorry please restart. Maybe with a different dataset?")
        })
      )
    });
    return promise;
  }

  saveData = (e) => {
    console.log(e)
    this.setState({ dataArr: e })
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
