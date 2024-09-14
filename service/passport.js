const passport = require('passport')
const { prisma } = require('../DB/db.config')
const jwt = require('jsonwebtoken')
const GoogleStrategy = require('passport-google-oauth20').Strategy




passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.SECRET_ID,
    callbackURL: "http://localhost:8000/api/v1/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) =>{
        try {
            console.log(accessToken, refreshToken, profile)
            let user = await prisma.user.findUnique({
                where:{ email: profile.emails[0].value}
            })
            if(!user){
                user = await prisma.user.create({
                    data:{
                        name:profile.displayName,
                        email:profile.emails[0].value,
                        passwordHash: null
                    }
                })
            }

            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIREIN})
            
            return done(null, {user, token})

        } catch (error) {
            return done(error, null);
        }
}))

// // Serialize the user to store in the session
// passport.serializeUser((user, done) =>{
//     done(null, user)
// })

// // Deserialize the user from the session
// passport.deserializeUser((user, done) => {
//     done(null, user);
//   });

module.exports = passport