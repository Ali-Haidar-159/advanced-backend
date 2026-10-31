// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 
let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy ;

let prisma = require("../utils/prisma.utils");

passport.use(new LocalStrategy({usernameField:"email"}, async function(email, password, done) {

        let user = await prisma.user.findFirst({
            where : {
                email 
            }
        }) ;

        if (!user){
            return done(null,false);
        }
        else{
            if(user.password == password){
                return done(null, user);
            }
            else{
                return done(null,false);
            }
        } 
    }
));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    try{
        let user = await prisma.user.findUnique({
            where : {
                id : id
            }
        });

        if(user){
            done(null, user);
        }
        else{
            done(null,false)
        }
    }
    catch(err){
        done(err, false);
    }
});

// ===== exports code ===== 

