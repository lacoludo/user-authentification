// Import frameworks + libraries
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var session = require('express-session')
var connectMongo = require('connect-mongo')(session)

// Connect to MongoDB
mongoose.connect('mongodb://localhost/user-authentification')
var db = mongoose.connection

// Handle MongoDB error
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {})

// Tracking logins
app.use(session({
  secret: 'future',
  resave: true,
  saveUninitialized: false,
  store: new connectMongo({mongooseConnection: db})
}))

// Parse requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Serve front-end
app.use(express.static(__dirname + '/client'))

// Include routes
var routes = require('./routes/router')
app.use('/', routes)

// Catch error 404 + Error handler
app.use(function(req, res, next) {
  var err = new Error('File not found')
  err.status = 404
  next(err)
})

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.send(err.message)
})

// Pug configuration
app.set('view engine', 'pug')

// Port configuration
app.listen(7000, function() {
  console.log('Port 7000 : activated')
})
