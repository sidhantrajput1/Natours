const fs = require('fs');

const dotenv = require('dotenv')
dotenv.config({ path : './config.env' })
const mongoose  = require('mongoose');
const Tour = require('./../../model/tourModel.js');
const User = require('./../../model/userModel.js');
const Review = require('./../../model/reviewModel.js');


// db connection
// connectDB();

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
    console.log('DB connection Sucessful')
})

//  Read File json


const tours = JSON.parse( fs.readFileSync(`${__dirname}/tours.json`, 'utf-8' ));
const users = JSON.parse( fs.readFileSync(`${__dirname}/users.json`, 'utf-8' ));
const reviews = JSON.parse( fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8' ));

// import data into database 
const importData = async () => {
    try {
        await Tour.create(tours)
        await User.create(users, { validateBeforeSave : false })
        await Review.create(reviews)
        console.log("Data SuccessFully loaded !!");
        
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

// delete data from DB
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Data Succesfully deleted !!')
        
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

if(process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv)