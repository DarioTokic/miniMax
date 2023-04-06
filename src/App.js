import React, { Component } from 'react';
import './App.css';
import logo from './minimax.png';
import About from './Components/About/About';
import Table from './Components/Table/Table';
import Endgame from './Components/Endgame/Endgame';
import Switch from './Components/Switch/Switch';
import Score from './Components/Score/Score';

class App extends Component {

  tableRef = React.createRef();

  state = {
    aboutToggle: false,
    game: true,
    ending: "",
    multiplayer: "first", //first means ai second means multiplayer
    mode: "first", //first means dummy second means godmode
    firstPlayer: "first", //first means person plays first second means ai plays first
    scoreO: 0,
    scoreX: 0,
  }

  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  componentDidMount() {
    const el = document.querySelector(".App");
  
    if (this.isTouchDevice()) {
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

  showAboutHandler() {
    this.setState( prevState => { return {aboutToggle: !(prevState.aboutToggle)}})
  }

  startGameHandler() {
    this.setState({game: true})
  }

  endGameHandler(ending) {
    this.setState({game: false})
    this.setState({ending})
    console.log(ending)
    if(ending === "You lost" || ending === "X won") {
      this.setState(prevState => { return {scoreX: (prevState.scoreX + 1)}})
      console.log("scoreX++")
    }
    else if(ending === "You Won!" || ending === "O won") {
      this.setState(prevState => { return {scoreO: (prevState.scoreO + 1)}})
      console.log("scoreO++")
    }

    console.log(this.state.scoreO)
    console.log(this.state.scoreX)
  }

  changeMode = (mode) => {
    this.setState({mode})
    this.refreshGame()
  }

  changeFirstPlayer = (firstPlayer) => {
    this.setState({firstPlayer})
    this.setState({game: false})
    this.setState({ending: ""})
  }

  changeMultiplayer = (multiplayer) => {
    this.setState({multiplayer})
    this.setState({firstPlayer: "first"})
    this.refreshGame()
  }

  refreshGame = () => {

    if(!this.state.game) 
      this.setState({game: true})
    else {
      this.tableRef.current.clean();
      console.log(this.state.firstPlayer)
    }

    this.setState({scoreO: 0, scoreX: 0})
  }

  //<Mode switchTo={(mode) => this.changeMode(mode)} mode={this.state.mode} />

  render() {

    return (
      <div className='App font-face-gm'>
        <img src={logo} className="App-logo" alt="logo" />

        <Score scoreO={this.state.scoreO} scoreX={this.state.scoreX} />

        <div className='Switches'>
          <Switch switchTo={(multiplayer) => this.changeMultiplayer(multiplayer)} mode={this.state.multiplayer} firstText="ai" secondText="multiplayer" />
          {this.state.multiplayer === "first" ?
          <Switch switchTo={(mode) => this.changeMode(mode)} mode={this.state.mode} firstText="dummy" secondText="god" />
          : null
          }
          {this.state.multiplayer === "first" ?
          <Switch switchTo={(firstPlayer) => this.changeFirstPlayer(firstPlayer)} mode={this.state.firstPlayer} firstText="first" secondText="second" />
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
            <Endgame click={() =>this.startGameHandler()} outcome={this.state.ending}/> 
          } 
        </div>
         

        

        <button onClick={() =>this.showAboutHandler()} className='App-about-btn font-face-gm'>about</button>

        { this.state.aboutToggle ?
          <About clicked={() => this.showAboutHandler()}/>
        : null
        }
      </div>
    );
  }
}

export default App;
