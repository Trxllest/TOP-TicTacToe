/* 

The Gameboard respresents the state of the board
Each square holds a cell
A dropToken method to be able to add Cells to squares

*/

function Gameboard() {
    const rows = 3;
    const cols = 3;
    let board = [];

    //3x3 array representing board row 0 is the top row and col 0 is the left col
    const freshBoard = () => {
        board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for(let j = 0; j < cols; j++) {
                board[i].push(Cell());
            }
        }
    }

    // Method to get entire board
    const getBoard = () => board;

    // drop token on the row,col coordinate if it is available
    // We verify if the cell is empty and then change that cells value to the players token
    const dropToken = (row, col, player) => {
        //get the value of the cell chosen by the player
        const chosenCell = board[row][col].getValue();

        // if the value of the cell is not 0 (already being used) stop execution
        if (chosenCell) return;

        //otherwise it is a valid cell and a token can be placed here
        board[row][col].addToken(player);
    };


    //print the board
    const printBoard = () => {
        const boardWithCellVals = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellVals);
    };
    freshBoard();
    return {getBoard, dropToken, printBoard, freshBoard};

}


/* 
A cell represents one 'square' on the board and can gave:
    '': No player in the square
    X: Player 1's token
    O: Player 2's token
*/

function Cell () {
    let value = '';

    //Accept players token to change the value of the cell
    const addToken = (player) => {
        value = player;
    };

    // retrieves current value of the square
    const getValue = () => value;

    return {addToken, getValue};
}


function GameController( playerOneName = 'Player One', playerTwoName = 'Player Two') {

    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        if (gameOver) {
            // gameOver = false;
            // board.freshBoard();
            board.printBoard(); 
            console.log(`New Game...`);
        } else{
            board.printBoard();
            console.log(`${getActivePlayer().name}'s turn.`);
        }
    };

    let gameOver = false;

    const getGameStatus = () => gameOver;

    /*  This is where we would check for a winner and handle that logic,
    such as a win message. */
    const checkForWin = (board, player) => {
        // Check rows
        for (let i = 0; i < board.length; i++) {
            if (board[i].every(cell => cell.getValue() === player)) {
                return true
            }
        }
        
        // Check columns
        for (let i = 0; i < board[0].length; i++) {
            if (board.every(row => row[i].getValue() === player)) {
                return true
            }
        }

        // Check diagonals
        if (board[0][0].getValue() === player && board[1][1].getValue() === player && board[2][2].getValue() === player) {
            return true
        }
        if (board[0][2].getValue() === player && board[1][1].getValue() === player && board[2][0].getValue() === player) {
            return true
        }

        return false;
    };

    function checkForDraw(board) {
        for (let row of board) {
            for (let cell of row) {
                if (cell.getValue() === '') {
                    return false; // There's an empty cell, so it's not a draw.
                }
            }
        }
        return true; // All cells are filled, and there's no winner, so it's a draw.
    }
    

    const playRound = (row, col) => {
        // Drop a token for the current player
        console.log(
          `Dropping ${getActivePlayer().name}'s token into Row ${row} and Column ${col}`
        );
        board.dropToken(row,col, getActivePlayer().token);
    
         
        // Check for a win
        if (checkForWin(board.getBoard(), getActivePlayer().token)) {
            console.log(`${getActivePlayer().name} wins!`);
            gameOver = true;
            printNewRound();
            // Handle the win logic here, such as displaying a message and resetting the board.
            // You can reset the board by creating a new Gameboard instance.
        } else if (checkForDraw(board.getBoard())) {
            console.log("It's a draw!");
            gameOver = true;
            printNewRound();
            // Handle the draw logic here, such as displaying a draw message and resetting the board.
            // You can reset the board by creating a new Gameboard instance.
        } else {
            // Switch player turn
            switchPlayerTurn();
            printNewRound();
        }

        // Switch player turn
        // switchPlayerTurn();
        // printNewRound();
      };

    // Initial play game message
    printNewRound();

    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version, so I'm revealing it now
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        getGameStatus
  };

}


function ScreenController() {
    console.log('ran');
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";
    
        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
    
        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
    
        // Render board squares
        board.forEach( (row, rindex) => {
            row.forEach((cell, cindex) => {
            // Anything clickable should be a button!!
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            // Create a data attribute to identify the column
            // This makes it easier to pass into our `playRound` function 
            cellButton.dataset.column = cindex;
            cellButton.dataset.row = rindex;
            cellButton.textContent = cell.getValue();
            boardDiv.appendChild(cellButton);
          })
        })
    }

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        // Make sure I've clicked a column and not the gaps in between
        if (!selectedColumn && !selectedRow) return;


        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    // Initial render
    updateScreen();
    
    

    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

ScreenController();
