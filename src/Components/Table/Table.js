import React, { Component } from 'react';
import './Table.css'

class Table extends Component {

    state = {
        originalBoard: Array.from(Array(9).keys()),
        personPlayer: 'O',
        aiPlayer: 'X',
        winningCombinations: [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ],
        initialized: false,
        currentPlayer: 'O'
    }

    componentDidMount() {

        if (!this.state.initialized && this.props.firstPlayer === "second") {
            if(!this.checkWinHandler(this.state.originalBoard, this.state.personPlayer) && !this.checkTie())
                this.turnHandler(0, this.state.aiPlayer);

            this.setState({initialized: true});
        }
            
        for(let i = 0; i < 9; i++) {
            document.getElementById(i).addEventListener('click', this.choseTileHandler);
        }

    }

    componentWillUnmount() {
        for(let i = 0; i < 9; i++) {
            document.getElementById(i).removeEventListener('click', this.choseTileHandler);
        }
    }

    choseTileHandler = (tile) => {
        if(this.props.multiplayer === "first")
            this.setState({currentPlayer: this.state.personPlayer})
        if(typeof this.state.originalBoard[tile.target.id] == "number")
            this.turnHandler(tile.target.id, this.state.currentPlayer);
            if (this.props.multiplayer === "second") {
                if(this.state.currentPlayer === this.state.personPlayer)
                    this.setState({currentPlayer: this.state.aiPlayer})
                else
                    this.setState({currentPlayer: this.state.personPlayer})
            }
            
            if(!this.checkWinHandler(this.state.originalBoard, this.state.personPlayer) && !this.checkTie())
                if(this.props.multiplayer === "first")
                    this.turnHandler(this.bestTileFinder(), this.state.aiPlayer);
                
        
        
                
        tile.target.removeEventListener('click', this.choseTileHandler)
    }

    turnHandler = (tileId, player) => {
        let newBoard = this.state.originalBoard;
        newBoard[tileId] = player;
        this.setState({originalBoard: newBoard});
        document.getElementById(tileId).innerText = player;
        document.getElementById(tileId).removeEventListener('click', this.choseTileHandler, false)

        this.checkTie()


        let gameWon = this.checkWinHandler(this.state.originalBoard, player);
        if(gameWon) this.gameOver(gameWon);
    }

    checkWinHandler = (board, player) => {
        let plays = board.reduce((a, e, i) =>
            (e === player) ? a.concat(i) : a, []);

        let gameWon = null;
        for(let [index, win] of this.state.winningCombinations.entries()) {
            if (win.every(elem => plays.indexOf(elem) > -1)) {
                gameWon = {index: index, player: player};
                break;
            }
        }
        return gameWon;
    }

    emptyTilesFinder = (newBoard) => newBoard.filter(s => typeof s == "number")

    checkTie = () => {
        if(this.emptyTilesFinder(this.state.originalBoard).length === 0) {
            for(let i = 0; i < 9; i++) {
                document.getElementById(i).style.color = "#1F1F1F";
                document.getElementById(i).removeEventListener('click', this.choseTileHandler, false)
            }
            this.declareWinnerHandler("It's a tie");
            return true;
        }
        return false;
    }

    bestTileFinder = () => {

        if(this.props.mode === "first") {
            const emptyTiles = this.emptyTilesFinder(this.state.originalBoard);
            const randomIndex = Math.floor(Math.random() * emptyTiles.length);
            return emptyTiles[randomIndex];
        }
        else 
            return this.minimax(this.state.originalBoard, this.state.aiPlayer).index;
    }

    minimax = (newBoard, player) => {
        let availableSpots = this.emptyTilesFinder(newBoard);

        if(this.checkWinHandler(newBoard, this.state.personPlayer))
            return {score: -1}
        else if(this.checkWinHandler(newBoard, this.state.aiPlayer))
            return {score: 1}
        else if (availableSpots.length === 0) {
            return {score: 0};
        }

        var moves = []

        for(let i = 0; i < availableSpots.length; i++) {
            let move = {};
            move.index = newBoard[availableSpots[i]];
            newBoard[availableSpots[i]] = player;

            if(player === this.state.aiPlayer) {
                let result = this.minimax(newBoard, this.state.personPlayer);
                move.score = result.score;
            }
            else {
                let result = this.minimax(newBoard, this.state.aiPlayer);
                move.score = result.score;
            }

            newBoard[availableSpots[i]] = move.index;
            moves.push(move);
        }

        let bestMove;
        if(player === this.state.aiPlayer) {
            let bestScore = -10;
            for(let i = 0; i < moves.length; i++) {
                if(moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        else {
            let bestScore = 10;
            for(let i = 0; i < moves.length; i++) {
                if(moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove]
    }

    declareWinnerHandler = (ending) => {
        this.props.endgame(ending)
    }

    gameOver = (gameWon) => {
        for(let index of this.state.winningCombinations[gameWon.index]) {
            document.getElementById(index).style.color = 
                gameWon.player === this.state.personPlayer ? "#F2C777" : "#F24405"
        }
        for(let i = 0; i < 9; i++) {
            const cell = document.getElementById(i);
            cell.removeEventListener('click', this.choseTileHandler)
        }
        if (this.props.multiplayer === "first")
            this.declareWinnerHandler(gameWon.player === this.state.personPlayer ? "You Won!" : "You lost")
        else
            this.declareWinnerHandler(this.state.currentPlayer + " won")
    }

    clean = () => {
        this.setState({originalBoard: Array.from(Array(9).keys())})
        for(let i = 0; i < 9; i++) {
            document.getElementById(i).addEventListener('click', this.choseTileHandler);
            document.getElementById(i).innerText = "";
        }

        if(this.props.firstPlayer === "second") {
            document.getElementById(0).removeEventListener('click', this.choseTileHandler);
            document.getElementById(0).innerText = this.state.aiPlayer;
        }
            
    }

    render() {
        return (
            <table>
              <tr>
                  <td className={this.state.currentPlayer + " cell"} id="0"></td>
                  <td className={this.state.currentPlayer + " cell"} id="1"></td>
                  <td className={this.state.currentPlayer + " cell"} id="2"></td>
              </tr>
              <tr>
                  <td className={this.state.currentPlayer + " cell"} id="3"></td>
                  <td className={this.state.currentPlayer + " cell"} id="4"></td>
                  <td className={this.state.currentPlayer + " cell"} id="5"></td>
              </tr>
              <tr>
                  <td className={this.state.currentPlayer + " cell"} id="6"></td>
                  <td className={this.state.currentPlayer + " cell"} id="7"></td>
                  <td className={this.state.currentPlayer + " cell"} id="8"></td>
              </tr>
          </table>
        )
    }
    
};

export default Table;