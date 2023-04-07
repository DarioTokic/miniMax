import React from 'react';
import './Endgame.css';

/**
 * This component displays the outcome of the game and provides a button to start a new game.
 * @param {Object} props  - The props object that contains a click function that starts a new game and outcome string(You win!, You lose and It's a tie).
 * @return {JSX.Element} - The rendered Endgame component.
 */
const endgame = (props) => {
    return (
        <div className='Endgame'>
            <h1>{props.outcome}</h1>
            <button onClick={props.click} className='font-face-gm'>newGame</button>
        </div>
    )
}

export default endgame;