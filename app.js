const express = require("express")
const cookieParser = require('cookie-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require("path")
const searchFlight = require("./controller/flightController")
const bookingDetails = require("./controller/flightBookController")
const fare = require("./API/fare")
// const airlineCode = require("./API/airlineCode")
const dotenv = require("dotenv").config() //necessary to access environment variables
const app = express()
app.use(cookieParser());
const connectDb = require("./config/dbConnect")
const {registerUser, loginUser, logoutUser} = require("./controller/userController");
const validateToken = require("./middleware/validateToken");
const addPassengers = require("./controller/passengersController");
//as data is retrieved using html, we use urlencoded insted of express.json()
connectDb()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')))
app.use(express.static('public'));
app.use('*.css', (req, res, next) => {
    res.setHeader('Content-Type', 'text/css');
    next();
  });
const dashPath = path.join(__dirname, '.', 'public', 'html','dashboard.html');
const indexPath = path.join(__dirname, '.', 'public','html','index.html')
app.get("/", (req,res) => {
    res.sendFile(indexPath)
})
app.get("/bookingDetails", bookingDetails)
app.post("/registerUser",registerUser)
app.post("/loginUser", loginUser )
app.post("/searchFlight", searchFlight )
app.get("/dashboard", validateToken, (req,res) => {
    res.sendFile(dashPath)
})
app.get("/fare", fare)
// app.get("/airlinecode",airlineCode)
app.post("/addpassengers", addPassengers)
app.post("/logout",logoutUser)
app.post('/charge', async (req, res) => {
    try {
        const { token, amount } = req.body;

        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'INR',
            source: token,
            description: 'Booking payment',
        });

        // Handle successful payment
        res.send('Payment successful');
    } catch (error) {
        // Handle payment failure
        res.status(500).send('Payment failed');
        console.log(error)
    }
});
// app.get("/logout", (req, res) => {
//     res.clearCookie("token"); // Clear the token cookie
//     res.redirect("/"); // Redirect to the homepage or login page
// });
app.listen(8000, () => {
    console.log("app is listening to port 8000")
})

