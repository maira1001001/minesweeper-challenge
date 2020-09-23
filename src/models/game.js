/** @format */

const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  cols: {
    type: Number,
    required: true,
  },
  rows: {
    type: Number,
    required: true,
  },
  mines: {
    type: Number,
    required: true,
  },
  flags: {
    type: Number,
    default: 0,
  },
  isFirstClick: {
    type: Boolean,
    default: true,
  },
  lastGame: [{ type: Array, require: true }],
  board: [{ type: Array, require: true }],
  isGameOver: { type: Boolean, default: false },
  isGameWin: { type: Boolean, default: false },
});

module.exports = mongoose.model('game', gameSchema);
