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
  testObj: FormInput,
  output: PythonOutput,
  saveData: () => { },
  trackPython: (iteration_num, question_num, cluster_num) => { },
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataArr: null,
      iterationCount: 5, //default = 0
      testObj: "",
      output: "",
      saveData: this.saveData,
      trackPython: this.trackPython,
    };
  }

  trackPython = (filename, iteration_num, question_num, cluster_num) => {
    trackPromise(
      this.runPython(filename, iteration_num, question_num, cluster_num)
    )
  }

  runPython = (filename, iteration_num, question_num, cluster_num) => {
    const promise = new Promise((resolve, reject) => {
      this.setState({ iterationCount: this.state.iterationCount + 1 })
      const formData = new FormData();
      formData.append('filename', filename)
      formData.append('interation_num', iteration_num);
      formData.append('question_num', question_num)
      formData.append('cluster_num', cluster_num)
      console.log("Need Loading Symbol to Display Loading while the python finishes")
      resolve(
        axios.post('http://localhost:4500/python', formData, {
        }).then(res => {
          var outputsFromPython = res.data.name
          //If no SEPERATOR, gives entire output. Else, will seperate the diff parts into an array. Can handle when necessary.
          this.setState({ output: new PythonOutput(outputsFromPython.split("SEPERATOR")[0].trim()) })
          console.log("Done Python")
        }).catch(err => console.log(err))
      )
    });
    return promise;
  }

  saveData = (e) => {
    console.log(e)
    this.setState({ dataArr: e })
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
