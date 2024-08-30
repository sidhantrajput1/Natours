const mongoose = require('mongoose')

exports.connectDB = async () => {
    await mongoose.connect('mongodb+srv://sidhant:sidhant123@cluster0.guurp.mongodb.net/natours')
    .then(() => {
        console.log("DB Connected 👋");
    })
}
