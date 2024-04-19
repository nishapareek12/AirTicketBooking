const asynchandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const myuser = require("../models/userModel")
const validateToken = require("../middleware/validateToken")
const registerUser = asynchandler(async(req,res) => {
   const {username, email, password} = req.body;
   if(!username || !email || !password){
    res.status(400)
    throw new Error("enter complete data")
   }else{
     const userAvailable = await myuser.findOne({email});
     if(userAvailable){
        res.status(400)
        throw new Error("user already available")
     }
     const hashedpassword = await bcrypt.hash(password, 10)
     const user = await myuser.create({
        username,
        email,
        password: hashedpassword
     })
     if(user){
        res.status(201).json({
            status: 1,
            message: "new user created",
            data: user
        })
     }else{
        res.status(400)
        throw new Error("unable to create user")
     }

   }
})

const loginUser = asynchandler(async (req,res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("all fields are mandatory!")
    }else{
        const user = await myuser.findOne({email});
        if(user && (await bcrypt.compare(password, user.password))){
            const accessToken = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id
                }
            }, process.env.SECRET_KEY, {
                expiresIn: "1h"
            })
            res.cookie("token",accessToken, {httpOnly: true})
            res.cookie('username', user.username, { httpOnly: false }); // Set a cookie with the username
            
            res.redirect("/dashboard")
            // res.status(200).json({accessToken})
        }else{
            res.status(400)
            throw new Error("Unable to login")
        }
    }
})


const logoutUser = asynchandler(async (req, res) => {
    // Clear the token cookie
    res.clearCookie("token");
    res.redirect("/")
    console.log("logged out successfully!")
});

module.exports = {registerUser, loginUser, logoutUser};