const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'wavet@outlook.sk',
        pass: 'Kosice123'
    }
});

const mailOptions1 = (to) => ({
    from: 'wavet@outlook.sk',
    to,
    subject: 'Notification about end of Reservation',
    text: 'Your reservation ends in 10 minutes. If your vehicle remains parked in the spot after the reservation period expires, you will be penalized.'
});

const mailOptions2 = (to) => ({
    from: 'wavet@outlook.sk',
    to,
    subject: 'Verify your e-mail address',
    text: 'Hello, this is notification mail, if you want verified your email address click here: https://www.random.sk'
});

const mailOptions3 = (to, description) => ({
    from: 'wavet@outlook.sk',
    to,
    subject: 'You have strike!',
    text: `You should be more careful, you just received a strike for: ${description}`
});


const notificationMail = (to, mailOptions) => {
    transporter.sendMail(mailOptions(to), function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = {
    mailOptions1,
    mailOptions2,
    mailOptions3,
    notificationMail
};