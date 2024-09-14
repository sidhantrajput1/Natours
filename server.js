const dotenv = require('dotenv')
dotenv.config({ path : './config.env' })

process.on('uncaughtException' ,err => {
    console.log('UNCAUGHT EXCEPTION!☠️ Shutting down...' )
    console.log(err.name , err.message);
    
    process.exit(1);
    
})


const app = require('./app.js');
const mongoose  = require('mongoose');



// db connection
// connectDB();

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
    console.log('DB connection Sucessfully')
})


const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLER REJECTION!☠️ Shutting down...' )
    console.log(err.name , err.message);
    server.close(() => {
        process.exit(1);
    })
})




// mongodb+srv://sidhant:sidhant123@cluster0.guurp.mongodb.net/