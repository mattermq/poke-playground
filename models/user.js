const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fbScores: {
    type: Array,
  },
  arkScores: {
    type: Array,
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
