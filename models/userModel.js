const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./tourModel');
const bcrypt = require('bcryptjs');

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
      // this only works on Crea save!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  // only run if password actually modified
  if (!this.isModified('password')) {
    return next();
  }
  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwordConfirm Field
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
