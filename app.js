const express = require('express')
const app = express();
const morgan = require('morgan');

const AppError = require('./utils/appError.js')
const globalErrorHandler = require('./controllers/errorControllers.js')
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

// ! middlware

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})



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