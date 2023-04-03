import React, { Component } from 'react';
import './App.css';
import logo from './minimax.png';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      aboutToggle: false
    };
    this.showAboutHandler = this.showAboutHandler.bind(this);
  }

  componentDidMount() {
    const el = document.querySelector(".App");
    el.addEventListener("mousemove", (e) => {
      el.style.backgroundPositionX = -e.clientX/30 + "px";
      el.style.backgroundPositionY = -e.clientY/30 + "px";
    });
  }

  componentWillUnmount() {
    const el = document.querySelector(".App");
    el.removeEventListener("mousemove", (e) => {
      el.style.backgroundPositionX = -e.clientX/30 + "px";
      el.style.backgroundPositionY = -e.clientY/30 + "px";
    });
  }

  showAboutHandler() {
    this.setState( prevState => { return {aboutToggle: !(prevState.aboutToggle)}})
  }

  render() {

    return (
      <div className='App font-face-gm'>
        <img src={logo} className="App-logo" alt="logo" />

        <table>
          <tr>
              <td class="cell" id="0"></td>
              <td class="cell" id="1"></td>
              <td class="cell" id="2"></td>
          </tr>
          <tr>
              <td class="cell" id="3"></td>
              <td class="cell" id="4"></td>
              <td class="cell" id="5"></td>
          </tr>
          <tr>
              <td class="cell" id="6"></td>
              <td class="cell" id="7"></td>
              <td class="cell" id="8"></td>
          </tr>
      </table>


        { this.state.aboutToggle ?
          <div className='About'>
          
          <button onClick={this.showAboutHandler} className='font-face-gm'>X</button>

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
        : null
        }
        <button onClick={this.showAboutHandler} className='App-about-btn font-face-gm'>about</button>
      </div>
    );
  }
}

export default App;
