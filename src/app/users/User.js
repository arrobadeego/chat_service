/* eslint-disable func-names */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
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
  contacts: [{ user_id: String, status: String }],
  sent: [{ user_id: String, name: String, email: String, status: String }],
  received: [{ user_id: String, name: String, email: String, status: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
