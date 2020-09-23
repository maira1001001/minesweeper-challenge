/** @format */

const mongoose = require('mongoose');

const Game = require('../models/game');
const { configIsValid, newBoard, getConfigForLevel } = require('./utils');

async function healthcheck(req, res) {
  res.status(200).json({
    dbState: mongoose.STATES[mongoose.connection.readyState],
  });
}

async function createNewCustomGame(req, res) {
  try {
    console.log(req.body);
    let { rows, cols, mines } = req.body;
    rows = Number(rows);
    cols = Number(cols);
    mines = Number(mines);

    if (configIsValid(rows, cols, mines)) {
      const newCustomGame = await Game.create({
        rows,
        cols,
        mines,
        board: newBoard(rows, cols),
        lastGame: newBoard(rows, cols),
      });
      res.status(200).json({ data: newCustomGame });
    } else {
      res.status(400).end('Configuration is not valid');
    }
  } catch (e) {
    console.error(e);
    res.status(400).end('Game can not be created');
  }
}

async function createNewGame(req, res) {
  try {
    const { rows, cols, mines } = await getConfigForLevel(req.body.level);
    const newGame = await Game.create({
      rows,
      cols,
      mines,
      board: newBoard(rows, cols),
      lastGame: newBoard(rows, cols),
    });
    res.status(200).json({ data: newGame });
  } catch (e) {
    console.error(e);
    res.status(400).end(e, 'Game can not be created');
  }
}

async function getLastGame(req, res) {
  try {
    const games = await Game.find({}).lean().exec();
    const lastGame = games[games.length - 1];
    res.status(200).json({ data: lastGame });
  } catch (e) {
    console.error(e);
    res.status(400).end('Can not retrieve last game');
  }
}

async function saveLastGame(req, res) {
  try {
    const gameSaved = await Game.create(req.body);
    if (gameSaved) {
      res.status(200).json({ data: { game: gameSaved, wasSaved: true } });
    } else {
      res.status(404).json({ data: { game: [], wasSaved: false } });
    }
  } catch (e) {
    console.error(e);
    res.status(400).end('Last game could not be saved');
  }
}

module.exports = {
  healthcheck,
  createNewGame,
  createNewCustomGame,
  getLastGame,
  saveLastGame,
};
