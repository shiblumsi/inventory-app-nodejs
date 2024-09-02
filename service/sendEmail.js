const nodemailer = require('nodemailer')


exports.sendEmail = async options =>{
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })

    //define email option
    const mailOptions = {
        from: 'D-Bug Inventory <inventory@dbug.dev>',
        to : options.email,
        subject:options.subject,
        text:options.message
    }

    //send email
    await transporter.sendMail(mailOptions)
}