import React from 'react';
import './Score.css'

const score = (props) => (
    <div className='Score'>
        <p>Score</p>
        <p>O : {props.scoreO}</p>
        <p>X : {props.scoreX}</p>
    </div>
)


export default score;