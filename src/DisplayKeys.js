import React from 'react';
import axios from 'axios'

class Keys extends React.Component{
    state = {
        keys: null
    }

    componentDidMount(){
        axios.get('http://127.0.0.1:5000/keys').then((res)=>{
            this.setState({
                keys:res.data
            })
        })
    }
    //keys stores an array of public keys
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
