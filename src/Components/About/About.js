import React from 'react';
import './About.css'

const about = (props) => (
    <div className='About'>
          
          <button onClick={props.clicked} className='font-face-gm'>X</button>

            <p>
              The minimax algorithm is a decision-making algorithm commonly used in game theory and 
              artificial intelligence. In the context of tic tac toe, the algorithm is used to determine 
              the best move for a player by considering all possible moves and their outcomes.</p>
            <p>
              The algorithm works by simulating all possible moves for both players, assuming that each 
              player will make the best move available to them at each turn. The algorithm assigns a score 
              to each possible outcome, representing how favorable it is for the player whose turn it is to move.
            </p>

            <p>
              The algorithm then selects the move that results in the highest score for the current player, 
              assuming that the opposing player will choose the move that results in the lowest score for the 
              current player. This is why it is called minimax - the algorithm minimizes the maximum possible 
              loss for the current player.
            </p>

            <p>
              in summary, the minimax algorithm for tic tac toe involves simulating all possible moves and 
              their outcomes, assigning scores to each outcome, and selecting the move with the highest score 
              for the current player, assuming that the opposing player will choose the move that results in 
              the lowest score for the current player.
            </p>
        </div>
)

export default about;