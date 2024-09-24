// const otpGen = require("otp-generator")
// const twilio = require("twilio")

// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN

// const twilioClient = new twilio(accountSid, authToken)

// exports.sendOtp = async (req, res)=>{
//     try {
//         const {phoneNumber} = req.body
//         const otp = otpGen.generate(6, {upperCaseAlphabets:false, lowerCaseAlphabets:false,specialChars:false})
//         await twilioClient.messages.create({
//             body:`Your opt is: ${otp}. This otp valid for five minutes`,
//             to : phoneNumber,
//             from:process.env.TWILIO_PHONE_NUMBER
//         })
//         return res.status(200).json({
//             status:'success',
//             message:"OTP send successfully!"
//         })
//     } catch (error) {
//         return res.status(400).json({
//             status:'fail',
//             error:error.message
//         })
//     }
// }

// const admin = require('firebase-admin');

// const serviceAccount = require('../service/firebase-otp.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// exports.sendOtp = async (req, res)=>{
//   const { phoneNumber } = req.body;

//   if (!phoneNumber) {
//     return res.status(400).send({ message: 'Phone number is required' });
//   }

//   try {
//     const recaptchaVerifier = new admin.auth.RecaptchaVerifier('recaptcha-container', {
//       size: 'invisible',
//     });

//     const confirmationResult = await admin.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier);

//     res.status(200).send({ message: 'OTP sent successfully', data: confirmationResult });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).send({ message: 'Error sending OTP', error: error.message });
//   }
// };
