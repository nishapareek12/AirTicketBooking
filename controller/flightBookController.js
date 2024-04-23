const asynchandler = require("express-async-handler")
const Bookings = require("../models/flightBookmodel")
const bookingDetails = asynchandler(async (req,res) => {
    const formDataEncoded = req.query.formData
    formData=JSON.parse(decodeURIComponent(formDataEncoded))
    const {passengers, flightdata, paymentDetails} = formData
    if(!passengers || !flightdata || !paymentDetails ){
        throw new Error("enter mandatory details")
    }else{
        const booking = await  Bookings.create({
            passengers,
            flightdata,
            paymentDetails
    })
        if(booking){
            // console.log(booking.passengers)
            res.render("bookingDetails",{booking} )
            // res.status(201).json({
            //     status: 0,
            //     message: "Booking done",
            //     data: booking
            // })
        }else{
            res.status(400)
            throw new Error("unable to book ticket")
         }
    }
})

module.exports = bookingDetails;