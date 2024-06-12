var jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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
    const token = signToken(newUser._id);

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
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    // 1) check if email & password exits
    if (!email || !password) {
      throw new AppError(
        'Error for Email & Password',
        'Please Provide Email & Password',
        401
      );
    }

    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    if (!user) {
      throw new AppError('Incorrect Email ', 'Incorrect Email ', 400);
    }
    const correct = await user.correctPassword(
      `${password}`,
      `${user.password}`
    );
    console.log(correct);
    if (!correct) {
      throw new AppError('Incorrect Password', 'Incorrect  Password', 400);
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    next(error);
  }
};
