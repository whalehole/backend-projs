require('dotenv').config();
const express = require('express')
const logger = require('morgan')
const consumer = require('./consumer');

const app = express()
app.use(express.json())
app.use(logger('common'))
app.use(express.urlencoded({ extended: false }))

const register = require('./routes/register');
const login = require('./routes/login');
const todo = require('./routes/todo');
app.use('/register', register);
app.use('/login', login);
app.use('/todo', todo);

consumer();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})