const mongoose = require("mongoose");

// Define the booking schema
const bookingSchema = new mongoose.Schema({
    passengers: [{
        title: String,
        firstname: String,
        middlename: String,
        lastname: String,
        age: Number,
        email: String,
        phone: String
    }],
    flightdata: [{
        
        flightNumber : Number,
        carrierCode :String,
        departure : String,
        arrival : String
    }],
    paymentDetails: {
        paymentMethod: String,
        cardnumber: String,
        expiry: String,
        cvv: String,
        bankname: String,
        accountnumber: String,
        routingnumber: String
    }
});

// Create a Mongoose model for the booking schema
module.exports = mongoose.model('Bookings', bookingSchema);


