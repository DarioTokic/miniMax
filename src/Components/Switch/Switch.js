import React from 'react';
import './Switch.css';

const Switch = (props) => {

    let mode = props.mode;
    let firstClasses = "font-face-gm";
    let secondClasses = "font-face-gm";

    if(mode === "first") {
        firstClasses += " Active";
        secondClasses += " Inactive";
    }
    else {
        firstClasses += " Inactive";
        secondClasses += " Active";
    }

    return (
        <div className='Switch'>
            <button onClick={() => props.switchTo("first")} className={firstClasses}>{props.firstText}</button>
            <button onClick={() => props.switchTo("second")} className={secondClasses}>{props.secondText}</button>
        </div>
    )
}


export default Switch;