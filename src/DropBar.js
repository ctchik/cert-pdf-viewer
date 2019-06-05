import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import style from './DropBar.module.css';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const baseStyle = {
  display:"flex",
  justifyContent:"center",
  position:"relative",
  borderWidth: 2,
  borderColor: '#000',
  borderStyle: 'solid',
  boxSizing:"border-box",
};
const activeStyle = {
  borderColor: '#6c6',
  backgroundColor: '#eee'
};
const rejectStyle = {
  borderColor: '#c66',
  backgroundColor: '#eee'
};


class DropBar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      name: null,
      issueDay: null,
      issueMonth: null,
      issueYear: null,
      issuer: null, 
      certType: null, 
      issuerImage: null,
      ticket_id:null,
      fileType:null,
      verification: [
      {name: "transaction is confirmed", passed: false},
      {name: "issued by specific issuer", passed: false},
      {name: "has not been tampered with", passed: false},
      {name: "has not expired", passed: false},
      {name: "has not been revoked", passed: false},
      {name: "issuer authenticity", passed: false},
      {name: "overall", passed: false}],
      formValue: ''
    };
  }

  componentDidMount() {
    this.props.setClick(this.postJson);
  }

  toggle = () => {
    this.setState({
      show: !this.state.show
    });
  }

  handleVerify = () => {
    if(this.state.json !== null){
      this.postJson(this.state.json)
    }
  }

  changeMonth = (value) => {
    let month = null;
    switch (value) {
      case "01":
        month = "Jan";
        break;
      case "02":
         month = "Feb";
        break;
      case "03":
        month = "Mar";
        break;
      case "04":
        month = "Apr";
        break;
      case "05":
        month = "May";
        break;
      case "06":
        month = "Jun";
        break;
      case "07":
        month = "Jul";
        break;
      case "08":
         month = "Aug";
        break;
      case "09":
        month = "Sep";
        break;
      case "10":
        month = "Oct";
        break;
      case "11":
        month = "Nov";
        break;
      case "12":
        month = "Dec";
        break;
      default: 
        month = "Nan"
    }
    return month;
  }

  checkKey = (key) => {
    for(let i=0;i<this.props.keys.length;i++){
      if(key === this.props.keys[i]){
        return true;
      }
      console.log(key, this.props.keys[i]);
    }
    return false
  }

  clearState = () => {
    this.setState({
      name: null,
      issueDay: null,
      issueMonth: null,
      issueYear: null,
      issuer: null, 
      certType: null, 
      issuerImage: null,
      ticket_id:null,
      fileType:null,
      verification: [
      {name: "transaction is confirmed", passed: false},
      {name: "issued by specific issuer", passed: false},
      {name: "has not been tampered with", passed: false},
      {name: "has not expired", passed: false},
      {name: "has not been revoked", passed: false},
      {name: "issuer authenticity", passed: false},
      {name: "overall", passed: false}]
    })
  }

  checkFileType = (object) => {
    let regPdf = /.*.pdf/
    let regHtml = /.*.html/ 
    let pdf = regPdf.test(object.filename);
    let html = regHtml.test(object.filename);
    if(pdf === true){
      return 'pdf';
    }
    else if(html === true){
      return 'html';
    }
    else{
      return 'pdf'; //for testing old certificates.
    }
  }
  postJson = async (object) => {
    try{
      let fileType = this.checkFileType(object);
      if(fileType === 'none'){
        //error handling later
        throw "Unexpected error: Invalid file type detected.";
      }
      let issuedDate = object.issuedOn;
      let regEx = /(\d{4})-(\d{2})-(\d{2})/
      let match = regEx.exec(issuedDate);
      this.setState({
        name: object.recipientProfile.name,
        issueDay: match[3],
        issueMonth: this.changeMonth(match[2]),
        issueYear: match[1],
        issuer: object.badge.issuer.name, 
        issuerImage: object.badge.issuer.image,
        certType: object.badge.name,
        fileType: fileType
      })
    }
    catch(e){
      if(e === null){
        this.props.setError("Unexpected Error: Missing JSON file.");
        return;
      }
      this.props.setError(e);
      
    }
    try{
        //change localhost to http://143.89.2.220:5000/postjson
        await axios.post("http://127.0.0.1:5000/postjson", object).then(async (res)=>{ 
          
          //need to change the ticket number
          await axios.get(`https://chain.so/api/v2/get_tx/BTC/167c8455396823bfaca11ae5a4289ffab29d406fde0092a8922b038895d4b81b?fbclid=IwAR2Lub0SZ35dt83aYL3-_Rbd_sZZTTvrJBBbXu1vRu__1Rp5QfMT2Hj7t6o`).then(sec_res => {
          let check_key = this.checkKey(sec_res.data.data.inputs['0'].address)
          
          let ver = [
          {name: "transaction is confirmed", passed: sec_res.data.data['confirmations']>0},
          {name: "issued by specific issuer", passed: check_key},
          {name: "has not been tampered with", passed: res.data[1].passed},
          {name: "has not expired", passed: res.data[2].passed},
          {name: "has not been revoked", passed: res.data[3].passed},
          {name: "issuer authenticity", passed: res.data[4].passed},
          {name: "overall", passed: (sec_res.data.data['confirmations']>0) && check_key && res.data[1].passed && res.data[2].passed && res.data[3].passed && res.data[4].passed}] 
          this.setState(prevState => ({
            ticket_id:res.data[0].tx_id,
            verification: prevState.verification.map((obj,index) => ((obj.name === (ver[index]).name) ? Object.assign(obj, {passed: ver[index].passed}):obj))    
                }
            )
          )
          this.props.updateStatus(this.state.verification);
          console.log("done")
        })
        }
        )
      }catch(e){
        if(this.state.error === null){
          this.props.setError("Unexpected Error: Failed to verify through chain.so.");
          return;
        }
        console.log(e);
        return;
      }
    this.toggle();
  }

  onDrop = (acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try{
        let jsonObject = JSON.parse(e.target.result);
        this.clearState();
        this.props.clearState(); 
        this.postJson(jsonObject);
        this.props.updateJson(jsonObject);
      }
      catch(e){
        this.props.setError("Unexpected Error: Invalid JSON file.");
        return;
      }
    }
    reader.readAsText(acceptedFiles[0]);
  }

  handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try{
        let jsonObject = JSON.parse(e.target.result); 
        this.clearState();
        this.props.clearState(); 
        this.postJson(jsonObject);
        this.props.updateJson(jsonObject);
      }
      catch(e){
        this.props.setError("Unexpected Error: Invalid JSON file.");
        return;
      }
    }
    reader.readAsText(e.target.files[0]);
  }

  handleFormChange = (e) => {
    this.setState({
      formValue:e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios.get(this.state.formValue).then(res => {
      this.clearState();
      this.props.clearState(); 
      this.postJson(res.data);
      this.props.updateJson(res.data);
    })
  }

  handleNewWindow = (url) => {
    /**
     * This function is not used yet.
     * Another implemention is to use <a> and style it as a button.
     */
    let win = window.open(url,'blank');
    win.focus();
  }
	render(){
    let tick = "\u2713";
    let cross = "\u2716";
    return(<div><Dropzone accept="application/json" disableClick={true} onDrop={this.onDrop}>
      {({ getRootProps, getInputProps, isDragActive, isDragReject}) => {
        let styles = {...baseStyle}
        styles = isDragActive ? {...styles, ...activeStyle} : styles
        styles = isDragReject ? {...styles, ...rejectStyle} : styles

        return (
          <div className={style.boxContainer} {...getRootProps()} style={styles}>
            <input {...getInputProps()}/>
            <form className="form-inline" style={{position:"absolute", top:40}} onSubmit={this.handleSubmit}>
              <input  type="text" className={`form-control ${style.input}`} placeholder="Certificate Url" onChange={this.handleFormChange}/>
              <button className={`btn btn-success ${style.verifyBtn}`}  type="submit">Verify</button>
            </form>
            <div className={style.chooseFile}>
            <label style={{textDecoration:"underline", cursor:"pointer"}}>Choose JSON file<input type="file" onChange={this.handleFileChange} style={{display:"none"}}/></label><span>(you can also drag & drop file here)</span>
            {isDragReject && <span className="text-danger"> Unsupported file type...</span>}
            </div>
          </div>
        )
      }}
    </Dropzone>
    <Modal isOpen={this.state.show} toggle={this.toggle} size="lg">
      <ModalHeader toggle={this.toggle}>
        <div className={style.headerWrapper}>
          <div className={style.imageContainer}>
            <img className={style.issuerImage} src={this.state.issuerImage} alt="issuer"/>
          </div>
          <div className={style.headerContent}>
            <h1 className={style.certType}>{this.state.certType}</h1> 
            <h2 className={style.name}>{this.state.name}</h2>
            <span className={style.comment}>Issued on {this.state.issueDay+" "+this.state.issueMonth+", "+this.state.issueYear} by {this.state.issuer}</span>
          </div>
        </div>
      </ModalHeader>
      <ModalBody className={style.bodyWrapper}>
        <div className={style.progressBar}></div>
        <dl>
            <dt data-content={this.state.verification[0].passed? tick: cross}>Transaction Confirmation</dt>
            <dt data-content={this.state.verification[1].passed? tick: cross}>Issued by specified Issuer</dt>
            <dt data-content={this.state.verification[2].passed? tick: cross}>Checking Certificate Tampering</dt>
            <dt data-content={this.state.verification[3].passed? tick: cross}>Checking Expiration Date</dt>
            <dt data-content={this.state.verification[4].passed? tick: cross}>Checking Revoked Status</dt>
            <dt data-content={this.state.verification[5].passed? tick: cross}>Checking Authencity(of Issuer)</dt>
            <dt data-content={this.state.verification[6].passed? tick: cross}>Overall Validation</dt>
        </dl>
      </ModalBody>
      <ModalFooter>
      {(this.state.fileType === 'pdf' || this.state.verification[6].passed === false) && <button className="btn btn-primary" onClick={this.toggle}>Return</button>}
      {this.state.fileType === 'html' && this.state.verification[6].passed === true && <a className="btn btn-primary" href={this.props.contentUrl} download="certificate.html">View Certificate</a>}
      {this.state.fileType === 'html' && this.state.verification[6].passed === true && <button className="btn btn-secondary" onClick={this.toggle}>Return</button>}
      {//Not possible to open html file without downloading. 
       //this.state.fileType === 'html' && this.state.verification[6].passed === true && <a className="btn btn-primary" href={this.props.contentUrl} target="_blank" rel="noopener">View Certificate</a>
      }
      </ModalFooter>
    </Modal>  
    </div>)
	}	
}
export default DropBar; 
