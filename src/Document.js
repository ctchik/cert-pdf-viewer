import React from 'react';
import PDF from 'react-pdf-js';
import style from './Document.module.css';

class Document extends React.Component{
    state = {};
    onDocumentComplete = (pages) => {
        this.setState({ page: 1, pages });
    }
    
    handlePrevious = () => {
        if(this.state.page === 1){
            this.setState({ page: this.state.pages });
        }else{
            this.setState({ page: this.state.page - 1 });
        }
    }
    
    handleNext = () => {
        if(this.state.page === this.state.pages){
            this.setState({ page: 1 });
        }else{
            this.setState({ page: this.state.page + 1 });
        };
    }
    
    render() {
        return (
            <div>
            <br/>
            <div className={style.pager}>
                <span onClick={this.handlePrevious}>Previous</span>
                <span>Page: {`${this.state.page}/${this.state.pages}`}</span>      
                <span onClick={this.handleNext}>Next</span>
            </div>
            <PDF
                file={this.props.pdf}
                onDocumentComplete={this.onDocumentComplete}
                page={this.state.page}
            />
            </div>
        )
    }
}


export default Document;