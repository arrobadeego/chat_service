const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Invite', InviteSchema);
