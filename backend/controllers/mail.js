const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'wavet@outlook.sk',
        pass: 'Kosice123'
    }
});

const noticationMail = (to) => {
    const mailOptions = {
        from: 'wavethackbot@gmail.com',
        to,
        subject: 'Verify your e-mail address',
        text: 'Hello, this is notification mail, if you want verified your email address click here: https://www.random.sk'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = noticationMail;




