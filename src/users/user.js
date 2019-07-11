/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  status: {
    type: String,
    required: true,
  },
  contacts: [
    { user_id: String, status: String },
  ],
  sent: [
    { user_id: String, status: String },
  ],
  received: [
    { user_id: String, status: String },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
