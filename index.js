const express = require('express')
const logger = require('morgan')

const app = express()
app.use(express.json())
app.use(logger('common'))
app.use(express.urlencoded({ extended: false }))

const todo = require('./routes/todo');
app.use('/todo', todo);

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})