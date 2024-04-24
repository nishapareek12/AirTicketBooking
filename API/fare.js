const axios = require("axios")
const asynchandler = require("express-async-handler")
const refreshToken = require("../auth/refreshToken")


const fare = asynchandler(async({from, to, departure}) => {
    // let date = formatDate(departure)
    // function formatDate(dateString) {
    //     const [day, month, year] = dateString.split('-'); 
    //     return `${year}-${month}-${day}`;
    // }
    const api_key = process.env.FLIGHT_API_KEY
    const api_secret = process.env.FLIGHT_API_SECRET
    let auth_token = process.env.FLIGHT_FARE_TOKEN
    // const base_url = process.env.BASE_API_URL  
    
    const api_url =  `https://test.api.amadeus.com/v1/analytics/itinerary-price-metrics?originIataCode=${from}&destinationIataCode=${to}&departureDate=${departure}&currencyCode=INR&oneWay=false`

    let headers = {
        "X-API-KEY" : api_key,
        "X-API-SECRET" : api_secret,
        "Authorization": `Bearer ${auth_token}`,
        "content-type": "application/x-www-form-urlencoded"
    } 
    try{
       const response = await axios.get(api_url, {headers})
       
       const flight_fare = response.data.data[0].priceMetrics[2].amount
       
    //    console.log(flight_fare)
       return flight_fare

    }catch(err){
        if(err.response && err.response.status === 401){
            console.log("Token expired or invalid, refreshing...")
            try{
              
              const newToken = await refreshToken(process.env.FLIGHT_FARE_REFRESH_TOKEN, 'fare')
              auth_token = newToken;
              process.env.FLIGHT_FARE_TOKEN = newToken;
  
              headers.Authorization = `Bearer ${newToken}`;

              const retryResponse = await axios.get(api_url, {headers})
              // console.log(retryResponse.data)
              const flight_fare = retryResponse.data.data[0].priceMetrics[2].amount
              return flight_fare

            }catch(refreshError){
              console.error("failed to refresh token", refreshError)
              throw refreshError
            }
          }else{
              return null;
          }
    }

})

module.exports = fare
