const axios = require("axios")
const asyncHandler = require("express-async-handler")
const dotenv = require("dotenv").config()
const refreshToken = require("../auth/refreshToken")


const IATAcode = asyncHandler(async (city) => {
    
        // const city = this.city;
        const api_key = process.env.FLIGHT_API_KEY
        const api_secret = process.env.FLIGHT_API_SECRET
        const base_api_url = process.env.BASE_API_URL
        let auth_token = process.env.FLIGHT_IATA_TOKEN
        const api_url = `${base_api_url}?subType=CITY&keyword=${city}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL`
        let headers = {
            "X-API-KEY" : api_key,
            "X-API-SECRET" : api_secret,
            "Authorization": `Bearer ${auth_token}`,
            "content-type": "application/x-www-form-urlencoded"
        }
        try{        
          const response = await axios.get(api_url,{ headers })
          const iata_code = response.data.data[0].iataCode
          return iata_code
          
    }catch(err){
      if (err.response && err.response.status === 401) { // Token expired or invalid
        console.log("Token expired or invalid, refreshing...");
        try {
          
            const newToken = await refreshToken(process.env.FLIGHT_IATA_REFRESH_TOKEN, 'iata');
            auth_token = newToken;
            process.env.FLIGHT_IATA_TOKEN = newToken; // Update the token in the environment (not recommended in production)

            // Retry the request with the new token
            headers.Authorization = `Bearer ${newToken}`;
            const retryResponse = await axios.get(api_url, { headers });
            const iata_code = retryResponse.data.data[0].iataCode;
            return iata_code;
        } catch (refreshError) {
            console.error("Failed to refresh token", refreshError);
            throw refreshError;
        }
    } else {
        // Other errors
        console.log("Failed to fetch IATA code:", err);
        throw err;
    }
    }
    
})

module.exports = IATAcode