import React, { Component } from 'react';
import './App.css';
import logo from './minimax.png';
import About from './Components/About/About';
import Table from './Components/Table/Table';
import Endgame from './Components/Endgame/Endgame';
import Switch from './Components/Switch/Switch';
import Score from './Components/Score/Score';


/**
 * The main component for the Tic Tac Toe game
 */
class App extends Component {

  /**
   * A reference to the Table component
   * @type {React.RefObject<Table>}
   */
  tableRef = React.createRef();


  /**
   * The state of the component
   * @type {{aboutToggle: boolean, game: boolean, ending: string, multiplayer: string, mode: string, firstPlayer: string, scoreO: number, scoreX: number}}
   */
  state = {
    aboutToggle: false,   // toggle for about popup
    game: true,           // toggle for showing game or end result
    ending: "",           // text showed when game ends
    multiplayer: "first", // first means ai second means multiplayer
    mode: "first",        // first means dummy second means godmode
    firstPlayer: "first", // first means person plays first second means ai plays first
    scoreO: 0,            // score for O player
    scoreX: 0,            // score for X player, ai in sigle player
  }

  /**
   * Checks if the device is a touch device
   * @returns {boolean} True if device is a touch device, false othervise.
   */
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  /**
   * Adds event listeners for the device orientatuin and touch events.
   * Used for background parallax
   */
  componentDidMount() {
    const el = document.querySelector(".App");

    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
      window.addEventListener("deviceorientation", (e) => {
        const x = e.beta;     // rotation around x-axis
        const y = e.gamma;    // rotation around y-axis
        el.style.backgroundPositionX = x * 5 + "px";
        el.style.backgroundPositionY = y * 5 + "px";
      });
    } else if (this.isTouchDevice()) {
      el.addEventListener("touchmove", (e) => {
        el.style.backgroundPositionX = "0";
        el.style.backgroundPositionY = "0";
      });
    } else {
      el.addEventListener("mousemove", (e) => {
        el.style.backgroundPositionX = -e.clientX/50 + "px";
        el.style.backgroundPositionY = -e.clientY/50 + "px";
      });
    }

  }

  /**
   * Toggle the about popup.
   */
  showAboutHandler() {
    this.setState( prevState => { return {aboutToggle: !(prevState.aboutToggle)}})
  }

  /**
   * Starts a new game.
   */
  startGameHandler() {
    this.setState({game: true})
  }

  /**
   * Handles the end of the game.
   * Sets the game state to false and the ending state to the given parameter.
   * @param {string} ending - The ening state of the game.
   */
  endGameHandler(ending) {
    this.setState({game: false})
    this.setState({ending})
    if(ending === "You lost" || ending === "X won") {
      let lossAudio = new Audio("/loss.wav")
      lossAudio.play()
      this.setState(prevState => { return {scoreX: (prevState.scoreX + 1)}})
    }
    else if(ending === "You Won!" || ending === "O won") {
      let winAudio = new Audio("/win.wav")
      winAudio.play()
      this.setState(prevState => { return {scoreO: (prevState.scoreO + 1)}})
    }
  }

  /**
   * Toggles game mode between playing against smart and random ai
   * @param {string} mode 
   */
  changeMode = (mode) => {
    this.setState({mode})
    this.refreshGame()
  }

  /**
   * Toggles between playing first od second against ai.
   * @param {string} firstPlayer 
   */
  changeFirstPlayer = (firstPlayer) => {
    this.setState({firstPlayer})
    this.setState({game: false})
    this.setState({ending: ""})
  }


  /**
   * Toggles between singleplayer and multiplayer
   * @param {string} multiplayer 
   */
  changeMultiplayer = (multiplayer) => {
    this.setState({multiplayer})
    this.setState({firstPlayer: "first"})
    this.refreshGame()
  }

  /**
   * Restarts game.
   * If game already ended starts a new one, otherwise cleans the table and resets score.
   * Used in functions that change modes (changeMultiplayer, changeFirstPlayer and changeMode)
   */
  refreshGame = () => {

    if(!this.state.game) 
      this.setState({game: true})
    else {
      this.tableRef.current.clean();
    }

    this.setState({scoreO: 0, scoreX: 0})
  }

  /**
   * The main component of the game. It renders all the necessary components.
   * @return {JSX.Element} The rendered component
   */
  render() {
    return (
      <div className='App font-face-gm'>
        <img src={logo} className="App-logo" alt="logo" />

        <Score scoreO={this.state.scoreO} scoreX={this.state.scoreX} />

        <div className='Switches'>
          <Switch 
            switchTo={(multiplayer) => this.changeMultiplayer(multiplayer)} 
            mode={this.state.multiplayer} 
            firstText="ai" 
            secondText="multiplayer" 
          />

          {this.state.multiplayer === "first" ?
          <Switch 
            switchTo={(mode) => this.changeMode(mode)} 
            mode={this.state.mode} 
            firstText="dummy" 
            secondText="god" 
          />
          : null
          }

          {this.state.multiplayer === "first" ?
          <Switch 
            switchTo={(firstPlayer) => this.changeFirstPlayer(firstPlayer)} 
            mode={this.state.firstPlayer} 
            firstText="first" 
            secondText="second" 
          />
          : null
          }
          
        </div>
        

        <div className='GameContainer'>
          {this.state.game ?
            <Table 
              ref={this.tableRef} 
              endgame={(ending) => this.endGameHandler(ending)} 
              mode={this.state.mode} 
              firstPlayer={this.state.firstPlayer} 
              multiplayer={this.state.multiplayer}
              /> :
            <Endgame 
              click={() =>this.startGameHandler()} 
              outcome={this.state.ending}
            /> 
          } 
        </div>

        <button 
          onClick={() =>this.showAboutHandler()} 
          className='App-about-btn font-face-gm'
        >
        about
        </button>

        { this.state.aboutToggle ?
          <About clicked={() => this.showAboutHandler()}/>
        : null
        }
      </div>
    );
  }
}

export default App;
