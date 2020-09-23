/** @format */

function GameView(game) {
  var publicAPI = {
    game,
    renderBoard,
  };

  return publicAPI;

  /************** publicAPI ********************* */

  /**
   * Render the board inside the container, ready to be played.
   * The board contains rows (div's). Each row contains fields (div's).
   */
  function renderBoard() {
    var container = intializeContainer();
    var board = createBoard();

    for (let i = 0; i < game.rows; i++) {
      let row = createRow(i);

      for (let j = 0; j < game.cols; j++) {
        let field = createField(j);

        setValueToField(field, i, j);
        addEventsToField(field);
        addFieldToRow(field, row);
      }
      addRowToBoard(row, board);
    }
    addBoardToContainer(board, container);

    function intializeContainer() {
      var container = document.querySelector('.container');
      container.innerHTML = '';
      return container;
    }

    function createBoard() {
      var board = document.createElement('div');
      board.classList.add('board');
      if (game.isGameOver()) {
        board.classList.add('game-over');
      } else if (game.isGameWon()) {
        board.classList.add('game-won');
      } else {
        board.classList.add('in-game');
      }
      return board;
    }

    function createRow(id) {
      let row = document.createElement('div');
      row.setAttribute('id', id);
      row.classList.add('row');
      return row;
    }

    function createField(id) {
      let field = document.createElement('div');
      field.setAttribute('id', id);
      field.classList.add('field');
      return field;
    }

    function setValueToField(field, row, col) {
      if (game.isCovered(row, col)) {
        field.classList.add('covered');
      } else if (game.isFlagged(row, col)) {
        field.classList.add('flagged');
      } else if (game.isAMine(row, col)) {
        field.classList.add('mine');
      } else {
        field.classList.add('uncovered');
        if (game.hasNeighboringMines(row, col)) {
          const neighboringMines = game.neighboringMines(row, col);
          let numberClass = classNameFromNumber(neighboringMines);
          field.classList.add(numberClass);
          field.innerHTML = neighboringMines;
        }
      }
    }

    function addEventsToField(field) {
      addClickEvent(field);
      addRightClickEvent(field);
    }

    function addFieldToRow(field, row) {
      row.appendChild(field);
    }

    function addRowToBoard(row, board) {
      board.appendChild(row);
    }

    function addBoardToContainer(board, container) {
      container.appendChild(board);
    }
  }

  /**************************************************** */

  /**
   * Add on click event to the given field
   * @param {Field} div element
   */
  function addClickEvent(field) {
    field.addEventListener('click', function (e) {
      uncoverField(field);
    });
  }

  /**
   * Add Right click event to the given field
   * @param {Field} div element
   */
  function addRightClickEvent(field) {
    field.oncontextmenu = function (e) {
      e.preventDefault();
      flagField(field);
    };
  }

  function uncoverField(field) {
    var board = field.parentElement.parentElement;
    if (
      board.classList.contains('in-game') &&
      field.classList.contains('covered')
    ) {
      // play game
      const { row, col } = getBoardPosition(field);
      // Play the field
      game.uncoverField(row, col);
      // interaction: show results
      updateBoard(row, col, field);
    }
  }

  function updateBoard(row, col, divField) {
    if (game.isGameOver()) {
      showGameOverView(divField);
    } else if (game.isGameWon()) {
      showGameWonView(row, col, divField);
    } else {
      showResultView(row, col, divField);
    }
  }

  function showGameOverView(divField) {
    // TODO: refactor this function.
    // 1. board set to 'game-over'
    var boardField = document.querySelector('.board');
    boardField.classList.remove('in-game');
    boardField.classList.add('game-over');
    // 2. field selected: set with selected-mine
    divField.classList.remove('covered');
    divField.classList.add('uncovered');
    divField.classList.add('mine');
    divField.classList.add('seleted-mine');

    // 3. uncover all mines
    // get html board to iterate
    var boardDiv = document.querySelector('.board').children;

    for (let i = 0; i < game.rows; i++) {
      var rowsDiv = boardDiv[i].children;
      for (let j = 0; j < game.cols; j++) {
        divField = rowsDiv[j];
        if (game.isAMine(i, j)) {
          divField.classList.remove('covered');
          divField.classList.add('uncovered');
          divField.classList.add('mine');
        }
      }
    }
  }

  function showGameWonView(row, col, divField) {
    showResultView(row, col, divField);
    flagAllFields(divField);
    showWinnerMessage();

    function flagAllFields(divField) {
      var boardDiv = document.querySelector('.board').children;
      // iterate over the board to flag each field
      for (let i = 0; i < game.rows; i++) {
        var rowsDiv = boardDiv[i].children;
        for (let j = 0; j < game.cols; j++) {
          divField = rowsDiv[j];
          if (game.isFlagged(i, j)) {
            divField.classList.remove('covered');
            divField.classList.add('flagged');
          }
        }
      }
    }

    function showWinnerMessage() {
      var containerDiv = document.querySelector('#result');
      containerDiv.classList.remove('in-game');
      containerDiv.classList.add('game-win');
      var winLabel = document.createElement('span');
      winLabel.innerHTML = 'YOU WIN!';
      containerDiv.appendChild(winLabel);
    }
  }

  function showResultView(row, col, divField) {
    uncoverCurrentField(row, col, divField);
    if (currentFieldIsBlank(row, col, divField)) {
      uncoverNeighborsRecursively(row, col);
    }

    function uncoverCurrentField(row, col, divField) {
      if (game.isBlank(row, col)) {
        uncoverBlank(divField);
      } else {
        uncoverNumber(divField, row, col);
      }
    }

    function currentFieldIsBlank(row, col) {
      return game.isBlank(row, col);
    }

    function uncoverNeighborsRecursively(divField) {
      var boardDiv = document.querySelector('.board').children;

      for (let i = 0; i < game.rows; i++) {
        var rowsDiv = boardDiv[i].children;
        for (let j = 0; j < game.cols; j++) {
          divField = rowsDiv[j];

          if (game.isFlagged(i, j)) {
            coverWithFlag(divField);
          } else if (game.isBlank(i, j)) {
            uncoverBlank(divField);
          } else if (game.hasNeighboringMines(i, j)) {
            uncoverNumber(divField, i, j);
          }
        }
      }
    }
  }

  function getBoardPosition(field) {
    let row = field.parentElement.getAttribute('id');
    let col = field.getAttribute('id');
    return { row: Number(row), col: Number(col) };
  }

  function uncoverBlank(divField) {
    divField.classList.remove('covered');
    divField.classList.remove('flagged');
    divField.classList.add('uncovered');
  }

  function uncoverNumber(divField, row, col) {
    var neighboringMines = game.neighboringMines(row, col);
    var numberClass = classNameFromNumber(neighboringMines);
    divField.classList.remove('covered');
    divField.classList.remove('flagged');
    divField.classList.add('uncovered');
    divField.classList.add(numberClass);
    divField.innerHTML = neighboringMines;
  }

  function coverWithFlag(divField) {
    divField.classList.remove('covered');
    divField.classList.add('flagged');
  }

  function flagField(field) {
    var board = field.parentElement.parentElement;
    if (board.classList.contains('in-game')) {
      const { row, col } = getBoardPosition(field);
      if (field.classList.contains('covered')) {
        field.classList.remove('covered');
        field.classList.add('flagged');
        game.flagAField(row, col);
      } else if (field.classList.contains('flagged')) {
        field.classList.remove('flagged');
        field.classList.add('covered');
        game.unflagAField(row, col);
      }
    }
  }

  function classNameFromNumber(number) {
    const MAPPING = {
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
      8: 'eight',
    };
    return MAPPING[number];
  }
}
