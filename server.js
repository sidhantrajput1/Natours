const dotenv = require('dotenv')
dotenv.config({ path : './config.env' })
const app = require('./app.js');
const mongoose  = require('mongoose');
const { connectDB } = require('./db/db.js');


// db connection
connectDB();


const port = process.env.PORT ||3000
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

// mongodb+srv://sidhant:sidhant123@cluster0.guurp.mongodb.net/