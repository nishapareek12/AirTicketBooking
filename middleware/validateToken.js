const jwt = require("jsonwebtoken")
const asynchandler = require("express-async-handler")

const validateToken = asynchandler(async (req,res, next) => {
   const token = req.cookies.token;
   if(!token){
    res.status(401).send("aceess denied! no token provided")
    return;
   }
   try{
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded;
    next();
   }catch(err){
    res.status(401).send('Access Denied: Invalid Token!');
   }
})

module.exports = validateToken;