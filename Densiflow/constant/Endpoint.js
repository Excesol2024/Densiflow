export const paymentIntent = {
    buySubscriptions: "/payment",
}

export const Authentication = {
    loginUser: "/users/sign_in",
    initialRegistration: "/initial_registration",
    userRegistration: "/users",
    logoutUser: "/users/sign_out",
    sendOtp: "/users/set_otp",
    validateOtp: "/users/validate_otp",
    resetPassword: "/users/update_password",
    deleteAccount: "/users/delete",
}

export const CurrentUser = {
    getSignedUser: "/me",
}

export const Weather = {
    getCurrentweather: "/user/weather",
}