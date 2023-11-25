var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'wavet@outlook.sk',
        pass: 'Kosice123'
    }
});

var mailOptions = {
    from: 'wavethackbot@gmail.com',
    to: 'jakubkaras123@gmail.com',
    subject: 'Notification',
    text: 'For confirmation your e-mail address click here: https://random.sk'
};

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.error(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});