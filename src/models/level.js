/** @format */

const mongoose = require('mongoose');

const level = new mongoose.Schema({
  rows: { type: Number, required: true },
  cols: { type: Number, required: true },
  type: {
    type: String,
    required: true,
  },
  mines: { type: Number, require: true },
});

module.exports = mongoose.model('level', level);
