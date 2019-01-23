import React, { Component } from 'react';
import DropBar from './DropBar'
import './App.css';
import Keys from './DisplayKeys';
import pdfFile from './sample.pdf';
import PDF from 'react-pdf-js';

class App extends Component {
  state = {
    jsonObject:null,
    extractedPdf:null
  }

  updateState = (jsonObject) =>{
    let str = jsonObject["pdfinfo"];
    //console.log(this.base64Decode(str))



    this.setState({
      jsonObject:jsonObject,
      extractedPdf:str
    })
  }

  render() {
    return (
    <div>
      <h1>HKUST Blockcert Verifier</h1>
      <DropBar updateJson={this.updateState}/>
      <br/>
      <Keys/>
      <PDF file={this.state.extractedPdf || pdfFile}/>
    </div>);
  }
}

export default App;
