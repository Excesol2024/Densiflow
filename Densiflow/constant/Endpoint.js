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
    createManualAccount: "/users/sign_up"
}

export const CurrentUser = {
    getSignedUser: "/me",
    uploadProfilePicture: "/user/update_photo",
    updateUserGender: "/user/gender"
}

export const Weather = {
    getCurrentweather: "/user/weather",
}


export const Feedbacks = {
    shareFeedbacks: "/user/feedbacks"
}

export const Reviews = {
    randomReviews: "/random/reviews",
    createReviews: "/user/reviews",
}

export const Notifications = {
    addNotifications: "/user/notify",
    userNotifications: "/user/all_notifications",
    deleteNotifications: "/user/notifications",
    findNotifications: "/find/notifications"
}

export const Places = {
    getPopularPlaces: "/places/popular",
    getRecommededPlaces: "/places/recommended",
    placeTypes: "/places/types",
    suggestedPlaces: "/places/suggested",
    searchPlaces: "/places/search",
    savedPlaces: "/user/places",
    getSavedPlaces: "/savedplaces",
    findPlace: "/places/find",
    deleteSavedPlace: "/user/savedplaces",
}