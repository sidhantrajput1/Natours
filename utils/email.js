const nodemailer = require('nodemailer');

const sendEmail = options => {
    // create a Transporter
    const transporter = nodemailer.createTransport({
        service : 'Gmail',
        auth : {
            user : process.env.EMAIL_USERNAME,
            pass : process.env.EMAIL_PASSWORD
        }
    })

    // Define the email Options


    // Actually send the email
}