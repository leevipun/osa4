const { request } = require('http')
const logger = require('./logger')
const { response } = require('../app')
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const extractToken = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    request.token = token;
  }

  next(); 
}

const extractUser = async (request, response, next) => {
  const token = request.token; 

  if (!token) {
    return response.status(401).json({ error: 'Token missing' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET); 
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token invalid' });
    }
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(401).json({ error: 'User not found' });
    }
    request.user = user._id;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  extractToken,
  extractUser
}