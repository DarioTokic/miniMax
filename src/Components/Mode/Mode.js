import React from 'react';
import './Mode.css'

const mode = (props) => {
    let mode = props.mode;

    let dummyClasses = "font-face-gm";
    let godClasses = "font-face-gm";

    if(mode === "god") {
        godClasses += " Active"
        dummyClasses += " Inactive"
    }
    else {
        dummyClasses += " Active"
        godClasses += " Inactive"
    }

    return (
        <div className='Mode'>
            <button onClick={() => props.switchTo("dummy")} className={dummyClasses} >dummy</button>
            <button onClick={() =>props.switchTo("god")} className={godClasses} >god</button>
        </div>
    )
    
}

export default mode;