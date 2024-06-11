var jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

exports.signUp = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log('signup');
  try {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(new AppError(error, "Can't create a user", 400));
  }
};
