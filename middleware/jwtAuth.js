const asynchandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const user = require('../Models/userSchema')
require('dotenv').config()

const protect = asynchandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      let token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.TOKEN_CODE)

      next()
    } catch (error) {
      res.status(400).json('TOKEN INVALID')
    }
  } else {
    res.status(401).json('TOKEN NOT FOUND')
  }
})

module.exports = { protect }
