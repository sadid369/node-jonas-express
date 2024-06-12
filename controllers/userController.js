const User = require('../models/userModel');
const AppError = require('../utils/AppError');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      throw new AppError('User not found', 'User not Found', 400);
    }
    res.status(200).json({
      status: 'success',
      result: users.length,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};
exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This route is not yet defined!' });
};
exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This route is not yet defined!' });
};
exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This route is not yet defined!' });
};
exports.deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This route is not yet defined!' });
};
