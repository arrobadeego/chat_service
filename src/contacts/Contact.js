/* eslint-disable func-names */
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
