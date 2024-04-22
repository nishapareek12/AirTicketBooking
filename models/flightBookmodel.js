const mongoose  = require("mongoose")

const flightbookSchema = new mongoose.Schema({
   flight_details: {
       flight_number: Number,
       carrier_code: String,
   } ,
   passenger : {
       title: String,
       firstname: String,
       middlename: String,
       lastname: String,
       age: Number
   },
   contact_details: {
      email: String,
      phone: Number  
   },
   payment_details: {
      pay_pal: String
   },
   class: {
      class: String
   },
   insurance : {
     insurance: Boolean
   }
})

module.exports = mongoose.model("flightbookmodel", flightbookSchema)