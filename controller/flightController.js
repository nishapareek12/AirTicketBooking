const fetchData = require("../API/fetchData")
const asyncHandler = require("express-async-handler")
const flightModel = require("../models/flightModel")
const moment = require('moment');
const IATAcode = require("../API/city_tocode")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config()
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
       }      
       
    // if (results.length === 0) {
    //     res.render('searchResults', { results: []});
    // } else {
    //     res.render('searchResults', { results });
    // }

    // if (results.length === 0) {
    //     res.render("searchResults", { results: [], isLoggedIn: !!req.cookies.token });
    // } else {
    //     res.render("searchResults", { results, isLoggedIn: !!req.cookies.token });
    // }
    const token = req.cookies.token;
    let isLoggedIn = false;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            isLoggedIn = true;
            // console.log(decoded); // Log decoded user information
        } catch (err) {
            console.log(err);
        }
    }
    // const isLoggedIn = req.cookies.token ? jwt.verify(req.cookies.token, process.env.SECRET_KEY) : false;
        console.log(isLoggedIn)
        res.render("searchResults", { results, isLoggedIn });
     }catch(err){
        console.log(err)
     }

    }
   
})


module.exports = searchFlight