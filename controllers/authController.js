const User = require('../models/userModel');
const AppError = require('../utils/AppError');

exports.signUp = async (req, res, next) => {
  //   const { name, email, password, confirmPassword, photo } = req.body;
  console.log('signup');
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      dta: {
        user: newUser,
      },
    });
  } catch (error) {
    next(new AppError(error, "Can't create a user", 400));
  }
};
