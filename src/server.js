'use strict'

const express = require('express')
const dotenv = require('dotenv')
const app = express()
const bodyParser = require('body-parser')
const config = require('../config')

dotenv.load()

app.set('json spaces', 2)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', require('./routes/tweets'))

app.use((req, res, next) => {
  res.status(404)
  console.log('BAD REQUEST', req.method, req.url)
  res.type('txt').send('Not found')
})

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Listening on port ${config.port}`)
})
