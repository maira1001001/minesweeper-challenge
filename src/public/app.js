/** @format */

var gameView;

document.addEventListener('DOMContentLoaded', createMinesweeperGame);

async function createMinesweeperGame() {
  let lastGameJson = await fetchLastGame();
  renderGame(lastGameJson.data);
}

function renderGame(gameJson) {
  gameLogic = GameLogic(gameJson);
  gameView = GameView(gameLogic);
  gameView.renderBoard();
}

async function newBoardOnClick(level) {
  var newGameJson = await fetchNewGame(level);
  renderGame(newGameJson.data);
}

async function newCustomBoardOnClick() {
  var spanValidationMsg = initializeValidationMessage();
  const { rows, cols, mines } = getConfigFromInputs();

  if (configIsValid(rows, cols, mines)) {
    var newGameJson = await fetchNewCustomGame(rows, cols, mines);
    renderGame(newGameJson.data);
  } else {
    setValidationMessageWitError(spanValidationMsg, rows, cols);
  }

  function initializeValidationMessage() {
    var spanValidationMsg = document.getElementById('custom-validation');
    spanValidationMsg.innerText = '';
    return spanValidationMsg;
  }

  function getConfigFromInputs() {
    const rows = document.getElementById('custom-rows').value;
    const cols = document.getElementById('custom-columns').value;
    const mines = document.getElementById('custom-mines').value;
    return { rows, cols, mines };
  }

  function configIsValid(rows, cols, mines) {
    return mines < rows * cols;
  }

  function setValidationMessageWitError(spanValidationMsg) {
    spanValidationMsg.innerHTML = `Number of mines should be less than ${
      rows * cols
    }`;
  }
}

async function saveGame() {
  const gameSaved = await fetchSaveGame();
  if (gameSaved.wasSaved) {
    renderSaveGameMessage('Last game was saved');
  } else {
    renderSaveGameMessage('An error happen. Game can not be saved');
  }

  function renderSaveGameMessage(message) {
    var saveGameSapn = document.querySelector('#save-game-msg');
    saveGameSapn.innerHTML = message;
  }
}

async function fetchNewCustomGame(rows, cols, mines) {
  try {
    let data = { rows, cols, mines };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch('/dev/new-custom-game', options);
    const json = await response.json();
    return json;
  } catch (err) {
    console.log(err, 'an error happens');
  }
}

async function fetchNewGame(level) {
  try {
    const data = { level };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch('/dev/new-game', options);
    const json = await response.json();
    return json;
  } catch (err) {
    console.log(err, 'an error happens');
  }
}

async function fetchLastGame() {
  try {
    const response = await fetch('/dev/last-game');
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err, 'an error happens');
  }
}

async function fetchSaveGame() {
  try {
    const isFirstClick = gameView.game.getIsFirstClick();
    const lastGame = gameView.game.getLastGame();
    const isGameOver = gameView.game.isGameOver();
    const isGameWon = gameView.game.isGameWon();
    const { rows, cols, mines, board, flags } = gameView.game;
    const data = {
      rows,
      cols,
      mines,
      board,
      lastGame,
      flags,
      isGameWon,
      isGameOver,
      isFirstClick,
    };
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch('/dev/save-game', options);
    const json = await response.json();
    return json.data;
  } catch (err) {
    console.log(err, 'an error happens');
  }
}
