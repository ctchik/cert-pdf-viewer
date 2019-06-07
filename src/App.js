import React, { Component } from 'react';
import DropBar from './DropBar';
import './App.css';
import Keys from './DisplayKeys';
import Document from './Document';
import Error from './Error';

class App extends Component {
  state = {
    jsonObject:null,
    extractedContent:null,
    fileType:null,
    keys:null,
    verification:null,
    error:null
  }

  setError = (error) => {
    this.setState({
      error:error
    })
  }

  clearState = () => {
    this.setState({
      extractedContent:null,
      verification:null,
      error:null,
      fileType:null
    })
  }

  updateStatus = report => {
    this.setState({
      verification:report
    })
  }

  updateKeys = keys => {
    this.setState({
      keys:keys
    })
  }

  updateState = (jsonObject, fileType) =>{
    try{
        let content = jsonObject['filecontent'];
        let encodedBytes = content;
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
        if(this.state.fileType === "pdf"){
          console.log('pdf')
          var blob = new Blob( [view], { type: "application/pdf" });
        }
        else{
          console.log('html')
          var blob = new Blob([view], {type:"text/html"});
        }
        var url = URL.createObjectURL(blob);
        this.setState({
          jsonObject:jsonObject,
          extractedContent:url,
          fileType: fileType
        })
    }catch(e){
      if(this.state.error == null){
        this.setError("Unexpected Error: Failed to extract Content.");
      }
      return;
    }
  }

  render() {
    return (
    <div className="container">
      <h1 className="header">HKUST Blockcerts Verifier</h1>
      <DropBar contentUrl={this.state.extractedContent} setError={this.setError} clearState={this.clearState} updateStatus={this.updateStatus} keys={this.state.keys} updateJson={this.updateState} setClick={postFunction => this.handleClick = postFunction}/>
      <br/>
      <Keys updateKeys={this.updateKeys}/>
      {this.state.error && <div className="text-danger">{this.state.error}</div>}
      <Error verification={this.state.verification}/>
      {this.state.fileType==="pdf" && this.state.verification && (this.state.verification[6].passed) && this.state.extractedContent && 
      <div>
        <a href={this.state.extractedContent} download="certificate.pdf">
          <button type="button" className="btn btn-primary" style={{marginRight:30}}>Download PDF</button>
        </a>
        <button type="button" className="btn btn-primary" onClick={() => this.handleClick(this.state.jsonObject)}>Verify Again!</button>
        <div>
          <Document pdf={this.state.extractedContent}/>
        </div>
      </div>}
    </div>);
  }
}

export default App;
