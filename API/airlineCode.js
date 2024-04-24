const asynchandler = require("express-async-handler")
const axios = require("axios")
const refreshToken = require("../auth/refreshToken")

const airlineCode = asynchandler( async (al_code) => {
    const api_key = process.env.FLIGHT_API_KEY
    const api_secret = process.env.FLIGHT_API_SECRET
    const base_api_url = process.env.BASE_API_URL
    let auth_token = process.env.FLIGHT_AIRLINE_TOKEN
    const api_url = `${base_api_url}/airlines?airlineCodes=${al_code}`
    // const api_url = `${base_api_url}/airlines?airlineCodes=AI`
    let headers = {
        "X-API-KEY" : api_key,
        "X-API-SECRET" : api_secret,
        "Authorization": `Bearer ${auth_token}`,
        "content-type": "application/x-www-form-urlencoded"
    }
    try{
       const response = await axios.get(api_url, {headers})
       const responsedata = response.data
       const code = responsedata.data[0].commonName
       return code
    }catch(err){
        if(err.response && err.response.status === 401){
          console.log("Token expired or invalid, refreshing...")
          try{
            
            const newToken = await refreshToken(process.env.FLIGHT_AIRLINE_REFRESH_TOKEN, 'airline')
            auth_token = newToken;
            process.env.FLIGHT_AIRLINE_TOKEN = newToken;

            headers.Authorization = `Bearer ${newToken}`;
            const retryResponse  = await axios.get(api_url, {headers})
            const responsedata = retryResponse.data
            const code = responsedata.data[0].commonName
            return code
          }catch(refreshError){
            console.error("failed to refresh token", refreshError)
            throw refreshError
          }
        }else{
            // console.log("failed to load airline code")
            return null;
        }
    }
})

module.exports = airlineCode