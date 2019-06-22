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
  password: {
    type: String,
    required: true,
    select: false,
  },
  status: {
    type: String,
    required: true,
  },
  timestamps: true,
});

UserSchema.pre('save', async (next) => {
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;

  next();
});

module.exports = mongoose.model('User', UserSchema);
