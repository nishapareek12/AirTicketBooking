const fetchData = require("../API/fetchData")
const asyncHandler = require("express-async-handler")
const flightModel = require("../models/flightModel")
const moment = require('moment');
const IATAcode = require("../API/city_tocode")

// const path = require("path")
// const fs = require("fs")
const searchFlight = asyncHandler(async (req,res) => {
     
    const { from, to, departure_date } = req.body;
    if(!from || !to || !departure_date){
        res.status(400)
        throw new Error("please enter mandatory fields")
    }else{
    function formatDate(dateString) {
        const [datePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-'); 
        return `${day}-${month}-${year}`;
    }
    function extractTime(datetimeString) {
        const timePart = datetimeString.split('T')[1];
        return timePart;
    }
     try{
        const fromCode = await IATAcode(from);
        const toCode = await IATAcode(to);
        const flightdata = await fetchData( fromCode, toCode, departure_date)
        // res.send(flightdata)
        let results = [] 
        for(let i = 0;i < flightdata.meta.count ;i++){  
            const segments = flightdata.data[i].segments
            let flightObject = {}  
            let segmentsArray = []
         for(let j = 0; j < segments.length; j++){
        const extracted_data = flightdata.data[i].segments[j]
        // console.log(`result ${j} `,extracted_data)
        const flightNumber = extracted_data.number
        const departureDate = formatDate(extracted_data.departure.at)
        const departureTime = extractTime(extracted_data.departure.at)
        const arrivalDate = formatDate(extracted_data.arrival.at)
        const arrivalTime = extractTime(extracted_data.arrival.at)
        const from  = extracted_data.departure.iataCode
        const to = extracted_data.arrival.iataCode
        segmentsArray.push({
            flight_number: flightNumber,
            departure_date: departureDate,
            departure_time: departureTime,
            arrival_date: arrivalDate,
            arrival_time: arrivalTime,
            from: from,
            to: to
        })
    }   
      Object.assign(flightObject, { flight : segmentsArray});
      results.push(flightObject)
       }       // console.log(results)
        // const fil_res = results.filter(flight => flight.from == from && flight.to == to)
        // console.log("filtered: ", fil_res)
        // const searchResults = results.filter( flight => flight.from == fromCode && flight.to == toCode && moment(flight.departure_date, "DD-MM-YYYY").isSame(departure_date, 'day'))
        if (results.length === 0) {
            res.json({ message: "No flights available for the given criteria" });
        } else {
         
            // const flightHTML = generateFlightHTML(results);
            // res.send(flightHTML)
                res.send(results);
        
    }
     }catch(err){
        console.log(err)
     }

    }
   
})

// function generateFlightHTML(flights) {
//     let html = `<html><head><title>Search Results</title><link rel='stylesheet' href="/css/style.css"></head><body><div class='search-results'>`;
//     flights.forEach(flight => {
//         html += `
//             <div class='flight-info'>
//                 <p><strong>Flight Number:</strong> ${flight.flight_number}</p>
//                 <p><strong>Departure:</strong> ${flight.from}</p>
//                 <p><strong>Departure Date:</strong> ${flight.departure_date}</p>
//                 <p><strong>Departure Time:</strong> ${flight.departure_time}</p>
//                 <p><strong>Arrival:</strong> ${flight.to}</p>
//                 <p><strong>Arrival Date:</strong> ${flight.arrival_date}</p>
//                 <p><strong>Arrival Time:</strong> ${flight.arrival_time}</p>
//                 <p><strong>Price:</strong> $${flight.price}</p>
//                 <button class='book-now-btn'>Book Now</button>
//             </div>
//         `;
//     });
//     html += "</div></body></html>";
//     return html;
// }



module.exports = searchFlight