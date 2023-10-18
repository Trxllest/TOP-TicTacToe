/* 

The Gameboard respresents the state of the board
Each square holds a cell
A dropToken method to be able to add Cells to squares

*/

function Gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];

    //3x3 array representing board row 0 is the top row and col 0 is the left col

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < cols; j++) {
            board[i].push(Cell());
        }
    }

    // Method to get entire board
    const getBoard = () => board;

    // drop token on the row,col coordinate if it is available
    // We verify if the cell is empty and then change that cells value to the players token
    const dropToken = (col, row, player) => {
        //get the value of the cell

        // if the value of the cell is not 0 (already being used) stop execution

        //otherwise it is a valid cell and a token can be placed here

        //print the board
        const printBoard = () => {
            const boardWithCellVals = board.map((row) => row.map((cell) => cell.getValue()));
            console.log(boardWithCellVals);
        }

        return {getBoard, dropToken, printBoard};

    }
}