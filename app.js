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
let itemsRouter = require('./routes/items')
let townsRouter = require('./routes/towns')
let countiesRouter = require('./routes/counties')
let deliveriesRouter = require('./routes/deliveries')

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
app.get('/api/user/:id', usersRouter.findOne)

app.post('/api/users/register', usersRouter.register)
app.post('/api/users/login', usersRouter.login)

// driver routes
app.get('/api/driver/:id', driversRouter.findOne)
app.get('/api/driver/:id/deliveries', driversRouter.findDeliveriesByDriver)

app.post('/api/drivers/register', driversRouter.register)
app.post('/api/drivers/login', driversRouter.login)

// item routes
app.get('/api/items/findall', itemsRouter.findAll)
app.get('/api/item/:id', itemsRouter.findOne)
app.get('/api/user/:userID/items', itemsRouter.findItemByUser)

app.post('/api/item/add', itemsRouter.addItem)

app.put('/api/item/update/:id', itemsRouter.updateItem)
app.put('/api/item/incrementview/:id', itemsRouter.incrementViews)

app.delete('/api/item/delete/:id', itemsRouter.deleteItem)

// town routes
app.get('/api/:county/towns', townsRouter.findTowns)
app.get('/api/towns/all', townsRouter.findAllTowns)

// county routes
app.get('/api/counties/findall', countiesRouter.findAllCounties)

// delivery routes
app.get('/api/deliveries/find/:town', deliveriesRouter.findItemForDelivery)

app.post('/api/delivery/add', deliveriesRouter.addDelivery)

app.put('/api/delivery/update/:id', deliveriesRouter.updateDelivery)

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
