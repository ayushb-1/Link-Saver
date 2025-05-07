// const asyncHandler = require('express-async-handler');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
// const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password,12)
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({_id: user._id}, 'secretkey123',{
    expiresIn: '30d',
  })
  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if(!user){
    res.status(404);
    throw new Error('User not found');
  } 
  const isPasswordValid = await bcrypt.compare(password,user.password)
  if(!isPasswordValid){
    res.status(401);
    throw new Error('invalid email or password');
  } 

  const token = jwt.sign({_id: user._id}, 'secretkey123',{
    expiresIn: '30d',
  })

  res.status(200).json({
    _id: user._id,
    email: user.email,
    token,
  });
};


module.exports = { registerUser, loginUser };