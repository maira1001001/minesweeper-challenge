<!-- @format -->

# Minewseeper videgame challente

[Play it](https://1ag6unegl7.execute-api.us-west-1.amazonaws.com/dev/)

# requirements

- [serverless](https://www.npmjs.com/package/serverless): `npm install -g serverless`

# commands

- installation: `npm install`
- run the server: `npm run dev`
- to deploy the lambda function: `npm run deploy`.

# Game.

## Client side

It is designed with basic html and css style. It is created dinamically with JS. The game is played in the client side.

## Server Side

It is an `API Rest` designed with `Nodejs` 12 using `express`, that runs in one `AWS lambda` function.

It serves

1. _static files_ from the `public` folder
2. _endpoints_:
   1. `GET /last-game`: it returns a json with the last game
   2. `POST /new-game { body: { level }} `: it returns a json with a new game for the given level, and creates a new game on data base. The level could be "beginner", "intermediate" o "advance"
   3. `POST /new-custom-game { body: { rows, cols, mines}} `: it returns a json with a new custom game with the given values, and creates a new game on data base.
   4. `PUT /save-game { body: {game}}`: it updates the game with the given value

## Workflow

Once the client request the main page (`GET /`), the server serves some static files (`index.html`, `style.css`, `app.js`, `gameLogic.js` and `gameView.js`) to render the game.

### GameLogic

The Game is played on the client. Once the board is rendered, the player begins the game. The player has two actions:

1. left click an covered field
2. right click on covered field
3. right click on flagged field

The field has three status:

1. `covered` (`undefined` or `null`)
2. `flagged` (100)
3. `uncovered` (0,1,...,8)

This module takes the data (json) and use this data to work and operates.

```
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
  ...
}
```

The logic take the data from the server which is a json.

The `GameLogic` has two board states: `board` y `lasGame`:

- `board`: is given just to render with the movements of the player. It contains the `covered` fields, the `flagged` fields and the fields which has already been `uncovered`

- `lastGame` contains the mines and the neighboring mines.

# TODO

1. show fields flagged
