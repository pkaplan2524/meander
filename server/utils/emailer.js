//*****************************************************************************
//
//  utils/email
//
//  Copyright Peter Kaplan 2019. All rights reserved.
//*****************************************************************************
const fs = require('fs');
const path = require('path');
const mailgen 	= require('mailgen');
const nodemailer = require('nodemailer');

var nlMailer = {
	mailgen:mailgen,
	nodemailer:nodemailer
};

//************************************************************************************
// Set up our outbound transport - This needs to move to env file
var smtpConfig = {
    host: 'a2plcpnl0224.prod.iad2.secureserver.net',
    port: 465,
    secure: true, // use SSL 
    auth: {
        user: 'nextlevel@pennywise-software.com',
        pass: 'nextlevel2524'
    }
};
var mailGenerator = new nlMailer.mailgen({
	theme: 'default',
    product: {
        // Appears in header & footer of e-mails 
        name: 'NextLevel Systems',
        link: 'https://10.10.20.103/',
        // Optional product logo 
        logo: 'http://10.10.20.103:3200/images/badge.jpg' 
    }
});
nlMailer.transport = nlMailer.nodemailer.createTransport(smtpConfig);

var welcome_email = {
    body: {
        name: 'John Appleseed',
        intro: 'Welcome to NextLevel Systems! We’re very excited to have you on board.',
        action: {
            instructions: 'To get started with your companies L10 system, please click here:',
            button: {
                color: '#22BC66', // Optional action button color 
                text: 'Confirm your account',
                link: 'http://localhost:3001'
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
};

nlMailer.createNewUserEmail = function( userName, email, confirmCode) {
	
	welcome_email.body.name = userName;
	welcome_email.body.action.button.link = "http://localhost:3001/api/pub/validate/" + encodeURIComponent(confirmCode);
	

	var emailBody = mailGenerator.generate(welcome_email);
	var emailText = mailGenerator.generatePlaintext(welcome_email);

	fs.writeFileSync('preview.html', emailBody, 'utf8');
	fs.writeFileSync('preview.txt', emailText, 'utf8');

	// setup e-mail data with unicode symbols 
	var mailOptions = {
	    from: '"NextLevel Systems Support 👥" <nextlevel@pennywise-software.com>', // sender address 
	    to: email, // list of receivers 
	    subject: 'Welcome to NextLevel', 
	    text: emailText, 
	    html: emailBody
	};

	nlMailer.transport.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	});
}

module.exports = nlMailer;
