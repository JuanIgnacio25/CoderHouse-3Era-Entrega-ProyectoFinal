const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PWD
    }
});


const nodeMailer = async (options) => {
    try {
        await transport.sendMail(options);
        console.log('email enviado');
    } catch (error) {
        console.log(error);
    }
}

module.exports = nodeMailer;