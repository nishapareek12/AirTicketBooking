const asynchandler = require("express-async-handler")
const Bookings = require("../models/flightBookmodel")
const bookingDetails = asynchandler(async (req,res) => {
    const formDataEncoded = req.query.formData
    formData=JSON.parse(decodeURIComponent(formDataEncoded))
    const {passengers, flightdata, flightFare, paymentDetails} = formData
    if(!passengers || !flightdata || !flightFare || !paymentDetails ){
        throw new Error("enter mandatory details")
    }else{
        const booking = await  Bookings.create({
            passengers,
            flightdata,
            flightFare,
            paymentDetails
    })
        if(booking){
            res.render("bookingDetails",{booking} )
        }else{
            res.status(400)
            throw new Error("unable to book ticket")
         }
    }
})

module.exports = bookingDetails;