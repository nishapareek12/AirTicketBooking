const express = require("express")
const cookieParser = require('cookie-parser');
// const IATAcode = require("./API/city_tocode")
const path = require("path")
// const fetchData = require("./API/fetchData")
const searchFlight = require("./controller/flightController")
const dotenv = require("dotenv").config() //necessary to access environment variables
const app = express()
app.use(cookieParser());
const connectDb = require("./config/dbConnect")
const {registerUser, loginUser, logoutUser} = require("./controller/userController");
const validateToken = require("./middleware/validateToken");
//as data is retrieved using html, we use urlencoded insted of express.json()
connectDb()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.static("./public"))
// app.use(express.static('public'));
// app.use('*.css', (req, res, next) => {
//     res.setHeader('Content-Type', 'text/css');
//     next();
//   });
const dashPath = path.join(__dirname, '.', 'public', 'html','dashboard.html');
const indexPath = path.join(__dirname, '.', 'public','html','index.html')
app.get("/", (req,res) => {
    // res.send("welcome to my air ticketing app")
    res.sendFile(indexPath)
})
app.post("/registerUser",registerUser)
app.post("/loginUser", loginUser )
app.post("/searchFlight", searchFlight )
// app.get("/iatacode/:city", IATAcode)
// app.post("/formData", searchFlight)
app.get("/dashboard", validateToken, (req,res) => {
    res.sendFile(dashPath)
    // res.render("dashPath", { loggedIn: true })
})

app.get("/logout", (req, res) => {
    res.clearCookie("token"); // Clear the token cookie
    res.redirect("/"); // Redirect to the homepage or login page
});
// app.get("/fetchdata", fetchData)
app.listen(8000, () => {
    console.log("app is listening to port 8000")
})

