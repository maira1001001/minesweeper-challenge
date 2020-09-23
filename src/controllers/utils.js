/** @format */
const Level = require('../models/level');

function configIsValid(rows, cols, mines) {
  return mines >= 0 && rows >= 0 && cols >= 0 && mines <= rows * cols;
}

function newBoard(rows, cols) {
  return Array(rows).fill(Array(cols).fill(undefined));
}

async function getConfigForLevel(levelType) {
  const level = await Level.find({ type: levelType }).lean().exec();
  const { rows, cols, mines } = level[level.length - 1];
  return { rows, cols, mines };
}

module.exports = { configIsValid, newBoard, getConfigForLevel };
