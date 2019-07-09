import React from 'react';
function Error(props){
    /**
     * Error handling when check failed
     */
    if(props.verification != null){
        return(
            <div>
            {(props.verification[6].passed===true) && <div class="text-success"><b>Document Verification passed.</b></div>}
            {(props.verification[6].passed===false) && <div><div class="text-danger"><b>Document Verification failed.</b></div></div>}
            <div>
            {(props.verification[6].passed===false) && <div><b>Unexpected Error:</b></div>}
            {(props.verification[0].passed===false) && <div class="text-secondary">- Transaction not found in Blockcerts registry.  Document invalid.</div>}
            {(props.verification[1].passed===false) && <div class="text-secondary">- Document not signed by HKUST</div>}
            {(props.verification[2].passed===false) && <div class="text-secondary">- Document tampered</div>}
            {(props.verification[3].passed===false) && <div class="text-secondary">- Document expired</div>}
            {(props.verification[4].passed===false) && <div class="text-secondary">- Document revoked</div>}
            {(props.verification[5].passed===false) && <div class="text-secondary">- Document not issued by HKUST (signing key expired)</div>}   
            </div>
            <br/>
            </div>
        )
    }
    return <div></div>
}

export default Error;