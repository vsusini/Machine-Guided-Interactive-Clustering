import './App.css';
import FileUpload from './components/inputForm/inputForm';
import React, { Component } from 'react';
import axios from 'axios';

export class FormInput {
  questionsPerIteration = ""
  numberOfClusters = ""
}

export const AppContext = React.createContext({
  dataArr: null,
  testObj: FormInput,
  saveData: () => { },
  runPython: () => { },
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataArr: null,
      testObj: "",
      saveData: this.saveData,
      runPython: this.runPython,
    };
  }

  runPython = () => {
    console.log("Starting")
    const formData = new FormData();
    formData.append('param1', 0); // appending file
    axios.post('http://localhost:4500/python', formData, {
    }).then(res => {
      console.log(res);
      console.log(res.data.name)
      console.log("Done")
    }).catch(err => console.log(err.response))
  }

  saveData = (e) => {
    console.log("made it", e)
    this.setState({ dataArr: e })
  }

  render() {
    let printData = () => {
      console.log(this.state.testObj)
    }
    return (
      <div className="App">
        <AppContext.Provider value={this.state}>
          <FileUpload></FileUpload>
          <button onClick={printData} className="upbutton">
            View DatatArr
          </button>
        </AppContext.Provider>
      </div>
    );
  }
}

export default App;
