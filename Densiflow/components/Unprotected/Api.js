import axios from "axios"
import { Authentication} from "../../constant/Endpoint"
import { SERVER_URL } from '@env'

  const newServeUrl = "https://densiflow.onrender.com"
  
const apiHelper = async (endpoint, method, body, params)=>{
  

    const headers = {
        'Content-Type': 'application/json',
    }

    try {
        const response = await axios({
            method: method,
            url: `${newServeUrl}${endpoint}`,
            headers: headers,
            data: body,
            params: params
        })
        return response
    } catch (error) {
        throw error.response?.data
    }
}
console.log("SERVER",newServeUrl)
export const API = {
    loginUser: (body => apiHelper(Authentication.loginUser, "POST", body)),
    register: (body => apiHelper(Authentication.userRegistration, "POST", body)),
    initialRegister: (body => apiHelper(Authentication.initialRegistration, "POST", body)),
    sendOtp: (body)=> apiHelper(Authentication.sendOtp, "POST", body),
    validateOtp: (body)=> apiHelper(Authentication.validateOtp, "POST", body),
    resetPassword: (body)=> apiHelper(Authentication.resetPassword, "PATCH", body),
    createManualAccount: (body)=> apiHelper(Authentication.createManualAccount, "POST", body),
}