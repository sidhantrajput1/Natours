const fs = require('fs');

const dotenv = require('dotenv')
dotenv.config({ path : './config.env' })
const mongoose  = require('mongoose');
const Tour = require('./../../model/tourModel.js');
const { json } = require('express');

// db connection
// connectDB();

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
    console.log('DB connection Sucessful')
})

//  Read File json


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import data into database 
const importData = async () => {
    try {
        await Tour.create(tours)
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
        console.log('Data Succesfully loaded !!')
        
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

if(process.argv[2] == '--import') {
    importData();
} else if(process.argv[2] == '--delete') {
    deleteData();
}

// console.log(process.argv)