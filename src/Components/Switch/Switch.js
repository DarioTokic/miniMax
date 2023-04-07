import React from 'react';
import './Switch.css';

/**
 * This component is used as switches for mode, firstPlayer and multiplayer states and others in the future.
 * @param {Object} props - The props object that contains switchTo(string) function that changes state between "first" and "second".
 * @returns {JSX.Element} - The rendered Switch component.
 */
const Switch = (props) => {

    // this part is used to add css classes to style buttons
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