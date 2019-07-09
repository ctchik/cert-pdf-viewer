import React from 'react';
import {Document} from 'react-pdf';

class PdfDisplay extends React.Component{
    state = {
        document:null
    }

    render(){
        <div><Document file={this.props.file} height={1500} width={800}/></div>
    }
}

export default PdfDisplay;