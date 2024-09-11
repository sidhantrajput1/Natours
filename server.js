const dotenv = require('dotenv')
dotenv.config({ path : './config.env' })
const app = require('./app.js');
const mongoose  = require('mongoose');



// db connection
// connectDB();

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
    console.log('DB connection Sucessfully')
})


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

// mongodb+srv://sidhant:sidhant123@cluster0.guurp.mongodb.net/