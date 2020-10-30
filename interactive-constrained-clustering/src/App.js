import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import Router from './components/router'
import 'bootstrap/dist/css/bootstrap.min.css';

export class FormInput {
  questionsPerIteration = ""
  numberOfClusters = ""
  maxConstraintPercent = ""
}

export const AppContext = React.createContext({
  dataArr: null,
  iterationCount: null,
  testObj: FormInput,
  saveData: () => { },
  runPython: (iteration_num, question_num, cluster_num) => { },
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataArr: null,
      iterationCount: 2, //default = 0
      testObj: "",
      saveData: this.saveData,
      runPython: this.runPython,
    };
  }

  runPython = (iteration_num, question_num, cluster_num) => {
    console.log("Need Loading Symbol to Display Loading while the python finishes")
    this.setState({ iterationCount: this.state.iterationCount + 1})
    const formData = new FormData();
    formData.append('interation_num', iteration_num);
    formData.append('question_num', question_num)
    formData.append('cluster_num', cluster_num)
    axios.post('http://localhost:4500/python', formData, {
    }).then(res => {
      console.log(res);
      console.log(res.data.name)
      console.log("Done")
    }).catch(err => console.log(err.response))
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
