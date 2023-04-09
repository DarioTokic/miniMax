import React, { Component } from 'react';
import './Table.css'

/**
 * This is the game component that contains all logic.
 */
class Table extends Component {

    state = {
        originalBoard: Array.from(Array(9).keys()), // The initial board state, with empty tiles represented by numbers 0-8.
        personPlayer: 'O',                          // The marker for the human player.
        aiPlayer: 'X',                              // The marker for the AI player.
        winningCombinations: [                      // The array of all the possible winning combinations.
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ],
        initialized: false,     // Weather the board has been initialized. Used when AI player goes first.
        currentPlayer: 'O'      // The current player/
    }

    /**
     * In this component, componentDidMount does two things:
     *  1. If the component hasn't been initialized and the first player is the second player,
     *  (meaning the AI goes first), it starts the game by having the AI make its first move
     *  2. It adds click event listeners to each tile on the board.
     * 
     * @function componentDidMount
     */
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

    /**
     * This function removes event listeners for all tiles on the board
     * 
     * @function componentWillUnmount
     */
    componentWillUnmount() {
        for(let i = 0; i < 9; i++) {
            document.getElementById(i).removeEventListener('click', this.choseTileHandler);
        }
    }

    /**
     * Function that handles the click event when a tile is chosen.
     * It updates the current player based on the game mode (single player or multiplayer),
     * calls the turn handler function to update the game board and checks for a win or tie.
     * If the game mode is single player, it calls the bestTileFinder function to determine 
     * the optimal tile for the AI player to choose.
     * Finally, it removes the event listener from the chosen tile.
     * 
     * @param {Object} tile - The tile object that player selected 
     */
    choseTileHandler = (tile) => {
        const clickAudio = new Audio("/click.wav")
        clickAudio.play()

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

    /**
     * Updates the game board with the selected tile by the cuttent player, 
     * and checks if the game is over either by a win or tie.
     * 
     * @param {number} tileId - The ID of the selected tile.
     * @param {string} player - The player who selected the tile.
     */
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

    /**
     * Checks if the given player has won the game on the current board.
     * 
     * @param {Array} board - The cuttent state of the board.
     * @param {string} player - The player for whom to check the win condition.
     * @returns {Object|null} - If the player has won the game, returns an object containing the winning combination and the player's symbol. Otherwise, returns null.
     */
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

    /**
     * Finds all the empty tiles in the game board.
     * 
     * @param {Array} newBoard - An array of the current game board state.
     * @returns {Array} An array of indices of all empty tiles in the board.
     */
    emptyTilesFinder = (newBoard) => newBoard.filter(s => typeof s == "number")

    /**
     * Checks if the game has ended in a tie.
     * 
     * @returns {boolean} Returns true if the game has ended in a tie, otherwise false.
     */
    checkTie = () => {
        if(this.emptyTilesFinder(this.state.originalBoard).length === 0) {
            for(let i = 0; i < 9; i++) {
                document.getElementById(i).style.color = "#1F1F1F";
                document.getElementById(i).removeEventListener('click', this.choseTileHandler, false)
            }
            this.declareWinnerHandler("It's a tie");
            const tieAudio = new Audio("/tie.wav");
            tieAudio.play()
            return true;
        }
        return false;
    }

    /**
     * Determines the best tile for the AI player to move to. If the game mode is "first", 
     * it chooses a random empty tile. Otherwise, it uses the minimax algorithm to determine 
     * the best move for the AI player.
     * 
     * @returns {number} The index of the best tile to move to.
     */
    bestTileFinder = () => {
        if(this.props.mode === "first") {
            const emptyTiles = this.emptyTilesFinder(this.state.originalBoard);
            const randomIndex = Math.floor(Math.random() * emptyTiles.length);
            return emptyTiles[randomIndex];
        }
        else 
            return this.minimax(this.state.originalBoard, this.state.aiPlayer).index;
    }

    /**
     * The minimax function implements the minimax algorithm to find the best move for the AI player.
     * 
     * @param {Array} newBoard - The current state of the board
     * @param {string} player - The current playe (either the AI player or the person player)
     * @returns {object} - Returns an object containing the best move.
     */
    minimax = (newBoard, player) => {

         // Find all available spots on the board.
         var moves = []
         let availableSpots = this.emptyTilesFinder(newBoard);

        // Check if the game has ended and return the appropriate score.
        if(this.checkWinHandler(newBoard, this.state.personPlayer))
            return {score: -1}
        else if(this.checkWinHandler(newBoard, this.state.aiPlayer))
            return {score: 1}
        else if (availableSpots.length === 0) {
            return {score: 0};
        }


        // Loop through available spots and recursively call minimax to calculate the score for each possible move
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

        // Find the best move for the AI player or the person player, depending on whose turn it is
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

    /**
     * This function is called when the game id over and declares the winner of the game by passing the ending message to the endgame prop.
     * 
     * @param {string} ending - The message to br displayed to declare the winner or ending of the game
     */
    declareWinnerHandler = (ending) => {
        this.props.endgame(ending)
    }

    /**
     * Markd the end of the game and displays the winner on the board.
     * 
     * @param {Object} gameWon - The object containing the winning combination and player.
     */
    gameOver = (gameWon) => {

        // Highlight the winning combination of cells.
        for(let index of this.state.winningCombinations[gameWon.index]) {
            document.getElementById(index).style.color = 
                gameWon.player === this.state.personPlayer ? "#F2C777" : "#F24405"
        }

        // Remove click event listener from all cells on the board.
        for(let i = 0; i < 9; i++) {
            const cell = document.getElementById(i);
            cell.removeEventListener('click', this.choseTileHandler)
        }

        // Display the winner on the board.
        if (this.props.multiplayer === "first")
            this.declareWinnerHandler(gameWon.player === this.state.personPlayer ? "You Won!" : "You lost")
        else
            this.declareWinnerHandler(this.state.currentPlayer + " won")
    }


    /**
     * Resets the game board and sets up event listeners on each tile.
     * If the game mode is player vs AI, sets the first move on top left tile as AI player 
     * (to save on time by not using minimax function on an empty board).
     */
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