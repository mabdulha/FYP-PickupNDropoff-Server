/* eslint-disable no-unused-vars */
let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
let cors = require('cors')

let indexRouter = require('./routes/index')
let usersRouter = require('./routes/users')
let driversRouter = require('./routes/drivers')
let items = require('./routes/items')

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// user routes
app.post('/api/users/register', usersRouter.register)
app.post('/api/users/login', usersRouter.login)

// driver routes
app.post('/api/drivers/register', driversRouter.register)
app.post('/api/drivers/login', driversRouter.login)

// item routes
app.get('/api/items/findall', items.findAll)
app.get('/api/item/:id', items.findOne)
app.get('/api/user/:userID/items', items.findItemByUser)

app.post('/api/item/add', items.addItem)

app.put('/api/item/update/:id', items.updateItem)
app.put('/api/item/incrementview/:id', items.incrementViews)

app.delete('/api/item/delete/:id', items.deleteItem)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
