const express = require('express')
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

const AppError = require('./utils/appError.js')
const globalErrorHandler = require('./controllers/errorControllers.js')
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const { whitelist } = require('validator');


// ! middlware

app.use(helmet())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json({ limit : '10kb' }));

// data senitization against noSQl query Injection
app.use(mongoSanitize())

// data senitization against XSS 
app.use(xss())

// preventing parameter pollution

app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers)
    next();
})

const limiter = rateLimit ({
    max : 10,
    windowMs : 60 * 60 * 100,
    message : 'To many Request from this IP , Please try again in an hour '
})


app.use('/api', limiter)


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status : 'fail',
    //     message : `Can't Find ${req.originalUrl} on this server`
    // })

    // const err = new Error(`Can't Find ${req.originalUrl} on this server`)
    // err.status = 'fail';
    // err.statusCode = 404

    next(new AppError(`Can't Find ${req.originalUrl} on this server`))
})

app.use(globalErrorHandler)

module.exports = app;