/**
 * @format
 * @param {Number} rows the number of the rows
 * @param {Number} cols the number of the columns
 * @param {Number} mines the number of the mines
 * @param {Number} flags the number of the flagged fields
 * @param {Array} board the board. It is a matrix rows * cols. It has the mine positions.
 * @param {Array} lastGame the board. It is a matrix rows * cols. It has the last game played.
 * @param {Boolean} gameOverFlag it indicates if the game is over
 * @param {Boolean} gameWinFlag it indicates if the game is won}
 */

function GameLogic({
  rows,
  cols,
  mines,
  flags,
  board,
  lastGame,
  isGameOver: gameOverFlag,
  isGameWon: gameWinFlag,
  isFirstClick,
}) {
  var visited = [];

  const FLAGGED = 100;
  const COVERED = undefined;
  const BLANK = 0;
  const MINE = -1;

  var publicAPI = {
    rows,
    cols,
    mines,
    lastGame,
    board,
    flags,
    isFlagged,
    isCovered,
    isBlank,
    isGameOver,
    isGameWon,
    isAMine,
    hasNeighboringMines,
    neighboringMines,
    uncoverField,
    numberOfFlags,
    flagAField,
    unflagAField,
    getIsFirstClick,
    getLastGame,
  };

  return publicAPI;

  /**************** publicAPI ***************** */
  /**
   * Describe if the given field (row,col) contains a flag
   * @param {Number} row the number of a row inside the board
   * @param {Number} col the number of a column inside the board
   * @returns {Boolean}. True when the field is covered. False otherwise
   */
  function isFlagged(row, col) {
    return lastGame[row][col] == FLAGGED;
  }

  /**
   * Describe if the given field (row,col) is a covered field, wich means it has no been played yet
   * @param {Number} row the number of a row inside the board
   * @param {Number} col the number of a column inside the board
   * @returns {Boolean} True when the field is covered. False otherwise
   */
  function isCovered(row, col) {
    return lastGame[row][col] == COVERED;
  }

  /**
   * Describe if the given field (row,col) is a blank field, wich means it has no neighboring mines
   * @param {Number} row the number of a row inside the board
   * @param {Number} col the number of a column inside the board
   * @returns {Boolean} True when the field is blank. False otherwise
   */
  function isBlank(row, col) {
    return lastGame[row][col] == BLANK;
  }

  /**
   * Describe true if the game is over. False, otherwise
   * @returns {Boolean}
   */
  function isGameOver() {
    return gameOverFlag;
  }

  /**
   * Describe true if the game is won. False, otherwise
   * @returns {Boolean}
   */
  function isGameWon() {
    return gameWinFlag;
  }

  /**
   *  Describe true when the given field (row, col) contains a mine
   * @param {Number} row the number of a row inside the board
   * @param {Number} col the number of a column inside the board
   * @returns {Boolean}. True when the field is blank. False otherwise
   */
  function isAMine(row, col) {
    return lastGame[row][col] == MINE;
  }

  /**
   *  Describe true when the given field (row, col) has at least one neighboring mine.
   *  False, when the given field has no neighboring mine
   * @param {Number} row the number of a row inside the board
   * @param {Number} col the number of a column inside the board
   * @returns {Boolean}
   */
  function hasNeighboringMines(row, col) {
    // prec: neither
    const value = lastGame[row][col];
    return value && value > 0 && value <= 8;
  }

  /**
   *  Describe the number of the neighboring mines for the given field (row,col).
   * @param {Number} row the number of a row inside the board
   * @param {Number} col the number of a column inside the board
   * @returns {Number} a number >= 0 and number <= 8
   */
  function neighboringMines(row, col) {
    // prec: has neighboring mines
    return lastGame[row][col];
  }

  /**
   * Uncover the given field (row,col).
   * The given field is covered and it will be uncovered.
   * @param {Number} row the number of a row inside the board
   * @param {Number} col the number of a column inside the board
   */
  function uncoverField(row, col) {
    if (isFirstClick) {
      setNeighboringMines(row, col);
      isFirstClick = false;
    }
    if (containsAMine(row, col)) {
      gameOver(row, col);
    } else {
      initializeVisited();
      uncover(row, col);
      if (checkIfIsGameWon()) {
        gameWinFlag = true;
        updateBoardWithFlags(); // TODO: podría ser tb "changeMinesToFlags"
      }
    }
  }

  /**
   * Describe the number of flagged fields
   * @returns {Number} number >=0 and number <= rows * cols
   */
  function numberOfFlags() {
    return flags;
  }

  /**
   * Flag the given field (row, col)
   * The given field does not contain a flag
   * @param {Number} row the number of a row inside the board
   * @param {Number} col the number of a column inside the board
   */
  function flagAField(row, col) {
    flags++;
    let rowAux = lastGame[row].slice();
    rowAux[col] = FLAGGED;
    lastGame[row] = rowAux;
  }

  /**
   * Remove the flag of the given field (row, col)
   * The given field contains a flag
   * @param {Number} row the number of a row inside the board
   * @param {Number} col the number of a column inside the board
   */
  function unflagAField(row, col) {
    flags--;
    let rowAux = lastGame[row].slice();
    rowAux[col] = undefined;
    lastGame[row] = rowAux;
  }

  /**
   * Return the last game played by the user. It is the visible board.
   * @returns {Array} Matrix rows * cols
   */
  function getLastGame() {
    return lastGame;
  }

  /**
   * Describe true when is the first click on the board. False, otherwise
   * @returns {Boolean}
   */
  function getIsFirstClick() {
    return isFirstClick;
  }

  /******************************************** */

  function updateBoardWithFlags() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (containsAMine(i, j)) {
          setLastGame(i, j, FLAGGED);
        }
      }
    }
  }

  function containsAFlag(row, col) {
    return lastGame[row][col] == FLAGGED;
  }

  /**
   * Describe true when the game is won.
   * When a game is won? When the number of fllaged and covered fields are equal to the number of mines
   */
  function checkIfIsGameWon() {
    return numbersOfFlagged() + numberOfCovered() == mines;

    function numbersOfFlagged() {
      var flaggedFields = lastGame.flat().filter((field) => field == FLAGGED);
      return flaggedFields.length;
    }

    function numberOfCovered() {
      var coveredFields = lastGame.flat().filter((field) => field == COVERED);
      return coveredFields.length;
    }
  }

  function setLastGame(row, col, value) {
    // TODO: try to set lastGame in this way: lastGame[i][j] = value, without using slice
    let rowAux = lastGame[row].slice();
    rowAux[col] = board.length == 0 ? undefined : value || board[row][col];
    lastGame[row] = rowAux;
  }

  function gameOver(row, col) {
    gameOverFlag = true;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (containsAMine(i, j)) {
          setLastGame(i, j, MINE);
        }
      }
    }
  }

  function uncover(row, col) {
    uncoverCurrentField(row, col);
    if (isFieldWithNeighboringMines(row, col)) return;
    else {
      setVisited(row, col); // set blank as visited
      for (let i = 0; i < 9; i++) {
        let { neighborRow, neighborCol } = getPositionAtNeighbor(row, col, i);
        if (
          i != 4 &&
          hasNeighborAt(neighborRow, neighborCol) &&
          !fieldHasBeenVisited(neighborRow, neighborCol) &&
          !containsAMine(neighborRow, neighborCol) // TODO: no debeestar. al rededor de 0 no hay minas
        ) {
          removeFlagIfItISFlagged(neighborRow, neighborCol);
          uncover(neighborRow, neighborCol);
        }
      }
    }

    function setVisited(row, col) {
      let rowAux = visited[row].slice();
      rowAux[col] = true;
      visited[row] = rowAux;
    }

    function uncoverCurrentField(row, col) {
      let rowAux = lastGame[row].slice();
      rowAux[col] = board[row][col];
      lastGame[row] = rowAux;
    }

    function removeFlagIfItISFlagged(row, col) {
      if (containsAFlag(row, col)) {
        flags--;
        removeFlag();
      }

      function removeFlag() {
        let rowAux = lastGame[row].slice();
        rowAux[col] = undefined;
        lastGame[row] = rowAux;
      }
    }

    function isFieldWithNeighboringMines(row, col) {
      return board[row][col] > 0;
    }

    function fieldHasBeenVisited(row, col) {
      return visited[row][col];
    }
  }

  function setNeighboringMines(row, col) {
    initializeBoardWithMines();
    if (containsAMine(row, col) && mineCanbeRelocated()) {
      relocateMine(row, col);
    }
    setBoardWithNeighboringMines();

    /**********************************/

    function initializeBoardWithMines() {
      var minesArr = Array(mines).fill(-1);
      var aux = Array(rows * cols - mines).fill(0);
      aux = aux.concat(minesArr);
      aux = aux.sort(() => Math.random() - 0.5);

      var slice;
      for (let i = 0; i < rows; i++) {
        slice = aux.slice(i * rows, i * rows + cols);
        board[i] = slice;
      }
    }

    function relocateMine(row, col) {
      // prec: (row, col) board position contains a mine and there is a position to |te the given mine
      var i = 0;
      var j = 0;
      var isAMine = true;
      while (isAMine && i < rows) {
        while (isAMine && j < cols) {
          if (!containsAMine(i, j)) {
            isAMine = false;
          } else {
            j++;
          }
        }
        if (isAMine) {
          j = 0;
          i++;
        }
      }
      setField(row, col, BLANK);
      setField(i, j, MINE);
    }

    function setField(row, col, value) {
      board[row][col] = value;
    }

    function mineCanbeRelocated() {
      return mines < rows * cols;
    }

    function setBoardWithNeighboringMines() {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (!containsAMine(i, j)) {
            let total = 0;
            for (let k = 0; k < 9; k++) {
              if (k != 4) {
                total += oneIfHasNeighboringMineAt(i, j, k);
              }
            }
            setBoard(i, j, total);
          }
        }
      }
    }

    function setBoard(row, col, value) {
      let rowAux = board[row].slice();
      rowAux[col] = value;
      board[row] = rowAux;
    }

    function oneIfHasNeighboringMineAt(row, col, i) {
      let { neighborRow, neighborCol } = getPositionAtNeighbor(row, col, i);
      return hasNeighborAt(neighborRow, neighborCol) &&
        containsAMine(neighborRow, neighborCol)
        ? 1
        : 0;
    }
  }

  function hasNeighborAt(row, col) {
    return row >= 0 && row < rows && col >= 0 && col < cols;
  }

  function getPositionAtNeighbor(row, col, i) {
    var boardPosition = [
      [row - 1, col - 1],
      [row - 1, col],
      [row - 1, col + 1],
      [row, col - 1],
      [row, col],
      [row, col + 1],
      [row + 1, col - 1],
      [row + 1, col],
      [row + 1, col + 1],
    ];
    return {
      neighborRow: boardPosition[i][0],
      neighborCol: boardPosition[i][1],
    };
  }

  function containsAMine(row, col) {
    return board[row][col] == MINE;
  }

  function initializeVisited() {
    visited = Array(rows).fill(Array(cols).fill(false));
  }
}
