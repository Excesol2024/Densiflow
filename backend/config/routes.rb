Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
}


   get "/me" => "users#current_user_info"
   patch "/firebase/expo/token" => "users#update_current_user_info"

   post 'initial_registration', to: 'otp#initial_registration'
   post 'payment', to: 'stripes#payment_intent'
   get 'payment/:id', to: "stripes#show_payment_details"
   post 'subscribe', to: "stripes#create"

   # UPDATE PASSWORD
    post 'users/set_otp', to: 'users#set_otp'
    post 'users/validate_otp', to: 'users#check_otp'
    patch 'users/update_password', to: 'users#update_password'
   # Route for creating a premium user
    post 'users/create_premium_user', to: 'users#create_premium_user'

    # DELETE ACCOUNT
    delete 'users/delete', to: 'users#delete_account'

    # CREATE MANUAL ACCOUNT
    post "users/sign_up", to: 'users#create'
    put "/user/update_photo", to: 'users#update_photo'

    #GET USER WEATHER
    post 'user/weather', to: 'weather#weather_for_user'
    get 'users/all', to: 'users#all_users'

    #SEND NOTIFICATIONS
    post "user/notifications", to: 'weather#send_push_notification'
    get "user/notifications", to: 'weather#show_access_token'


    #USERS NOTIFICATIONS
    post "user/notify", to: 'notifications#create'
    get "user/all_notifications", to: "notifications#user_notifications"
    delete "user/notifications", to: "notifications#delete_notifications"
    get "find/notifications", to: "notifications#find_notifications"

    #FEEDBACKS
    post "user/feedbacks", to: 'feedbacks#create'


    # RECOMMENDED_PLACES
    get "find_place", to: 'places#find_place'
    get "places/recommended", to: 'places#recommended'

    #POPULAR_PLACE
    get "places/popular", to: 'places#popular'

    #PLACES_TYPES
    post "places/types", to: 'places#places_types'

    #SUGGESTED_PLACE
    get "places/suggested", to: 'places#suggested_places'

    get "places/search", to: 'places#search_places'
    get "places/find", to: 'savedplaces#find_place'
    get "savedplaces", to: 'savedplaces#update_savedPlaces_crowdStatus'


    post "sampleplaces/types", to: 'places#sampleplaces_types'

    #UPDATE USER GENDER
    post 'user/gender', to: 'users#update_gender'

    #CREATE SAVED PLACES
    post 'user/places', to: 'savedplaces#create'
    get 'user/places', to: 'savedplaces#user_savedplaces'
    delete 'user/savedplaces', to: 'savedplaces#delete_saved_place'


    #REVIEWS
    get 'random/reviews', to: 'reviews#random_user_reviews'
    post 'user/reviews', to: 'reviews#create'
    get "find/reviews", to: "reviews#find_reviews"


    #BULK_EMAIL
    post 'send_message', to: 'otp#send_messages'

    #APP_UPDATE
    post 'send_update', to: 'appupdates#create'
    delete "user/appupdates", to: "appupdates#delete_appupdates"
    get "user/appupdates", to: "appupdates#user_appupdates"


  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "otp#home"
end
