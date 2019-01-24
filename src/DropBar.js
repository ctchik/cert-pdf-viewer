import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import style from './DropBar.module.css';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const baseStyle = {
  display:"flex",
  justifyContent:"center",
  height: 170,
  minWidth:400,
  position:"relative",
  borderWidth: 2,
  borderColor: '#000',
  borderStyle: 'solid',
  boxSizing:"border-box"
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
      verification: [
      {name: "transaction is confirmed", passed: false},
      {name: "issued by specific issuer", passed: false},
      {name: "has not been tampered with", passed: false},
      {name: "has not expired", passed: false},
      {name: "has not been revoked", passed: false},
      {name: "issuer authenticity", passed: false},
      {name: "*OVERALL VALIDATION", passed: false}],
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

  postJson = async (object) => {
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
    })
    await axios.post("http://127.0.0.1:5000/postjson", object).then((res)=>{
      this.setState(prevState => ({
        verification: prevState.verification.map((obj, i) => ((obj.name === (res.data[i]).name) ? Object.assign(obj, {passed: res.data[i].passed}):obj))
      }))
    }
    )
    this.toggle();
  }

  onDrop = (acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      let jsonObject = JSON.parse(e.target.result); 
      this.postJson(jsonObject);
      this.props.updateJson(jsonObject);
    }
    reader.readAsText(acceptedFiles[0]);
  }

  handleFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      let jsonObject = JSON.parse(e.target.result); 
      this.postJson(jsonObject);
      this.props.updateJson(jsonObject);
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
      this.postJson(res.data);
      this.props.updateJson(res.data);
    })
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
          <div {...getRootProps()} style={styles}>
            <input {...getInputProps()}/>
            <form className="form-inline" style={{position:"absolute", top:40}} onSubmit={this.handleSubmit}>
              <input type="text" className="form-control" placeholder="Certificate Url" onChange={this.handleFormChange}/>
              <button className="btn btn-success" type="submit">Verify</button>
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
        Some logo..
      </ModalFooter>
    </Modal>  
    </div>)
	}	
}
export default DropBar; 
