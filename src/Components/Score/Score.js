import React from 'react';
import './Score.css'

/**
 * This component displays score between O and X player.
 * @param {Object} props - The props object that contains score for O and X player.
 * @return {JSX.Element} - The rendered Score component.
 */
const score = (props) => (
    <div className='Score'>
        <p>Score</p>
        <p>O : {props.scoreO}</p>
        <p>X : {props.scoreX}</p>
    </div>
)


export default score;