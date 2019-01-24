import React, { Component } from 'react';
import DropBar from './DropBar'
import './App.css';
import Keys from './DisplayKeys';
import pdfFile from './sample.pdf';
import PDF from 'react-pdf-js';
import utf8 from 'utf8';
import base64 from 'js-base64';

class App extends Component {
  state = {
    jsonObject:null,
    extractedPdf:null
  }

  updateState = (jsonObject) =>{
    let encodedBytes = jsonObject["pdfinfo"];
    //console.log(this.base64Decode(str)
    var base64str = encodedBytes;

    // decode base64 string, remove space for IE compatibility
    var binary = atob(base64str.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
    }

    // create the blob object with content-type "application/pdf"               
    var blob = new Blob( [view], { type: "application/pdf" });
    var url = URL.createObjectURL(blob);
    
    this.setState({
      jsonObject:jsonObject,
      extractedPdf:url
    })
  }

  render() {
    console.log(this.state.extractedPdf)
    return (
    <div>
      <h1>HKUST Blockcert Verifier</h1>
      <DropBar updateJson={this.updateState}/>
      <br/>
      <Keys/>
      {this.state.extractedPdf && <PDF file={this.state.extractedPdf}/>}
    </div>);
  }
}

export default App;
