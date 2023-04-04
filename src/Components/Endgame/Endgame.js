import React from 'react';
import './Endgame.css';

const endgame = (props) => {
    return (
        <div className='Endgame'>
            <h1>{props.outcome}</h1>
            <button onClick={props.click} className='font-face-gm'>newGame</button>
        </div>
    )
}

export default endgame;