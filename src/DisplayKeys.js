import React from 'react';
import axios from 'axios'

class Keys extends React.Component{
    /**
     * Fetching keys from the HKUST's server.
     */
    constructor(props){
        super(props);
        this.state = {
            keys:null
        }
    }
    componentDidMount(){
        try{
            axios.get('http://143.89.2.220:5000/keys').then((res)=>{
                this.props.updateKeys(res.data)
                this.setState({
                    keys:res.data
                })
            })
        }
        catch(e){
            console.log("Not able to access server.");
            return;
        }   
    }
    //keys store an array of keys
    render(){
        if(this.state.keys == null){
            return <div><b>Error, no key is fetched from server.</b></div>
        }
        return(<div><b>Public keys used by HKUST:</b><ul>{
                    (this.state.keys).map((key,index)=>{return <li key={index}>{key}</li>})  
            }</ul></div>)
    }
}

export default Keys