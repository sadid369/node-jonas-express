const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./tourModel');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must provide his or her name'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'User must provide email'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'User must provide password'],
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'User must provide confirm password'],
    minLength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
