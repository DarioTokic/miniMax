import React, { Component } from 'react';
import './App.css';
import logo from './minimax.png';
import About from './Components/About/About';
import Table from './Components/Table/Table';
import Endgame from './Components/Endgame/Endgame';
import Mode from './Components/Mode/Mode';

class App extends Component {


  state = {
    aboutToggle: false,
    game: true,
    ending: "",
    mode: "god"
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
  }

  changeMode = (mode) => {
    this.setState({mode})
  }

  render() {

    return (
      <div className='App font-face-gm'>
        <img src={logo} className="App-logo" alt="logo" />

        <Mode switchTo={(mode) => this.changeMode(mode)} mode={this.state.mode} />
        
        {this.state.game ?
          <Table endgame={(ending) => this.endGameHandler(ending)} mode={this.state.mode} /> :
          <Endgame click={() =>this.startGameHandler()} outcome={this.state.ending}/> 
        }  

        


        { this.state.aboutToggle ?
          <About clicked={() => this.showAboutHandler()}/>
        : null
        }
        <button onClick={() =>this.showAboutHandler()} className='App-about-btn font-face-gm'>about</button>
      </div>
    );
  }
}

export default App;
