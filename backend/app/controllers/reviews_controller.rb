require_relative '../api/googleapi'

class ReviewsController < ApplicationController
  before_action :authenticate_user! 

  def random_user_reviews
    if current_user
      lat = current_user.lat
      long = current_user.long
      google_service = Googleapi.new(nil)
      reviews = google_service.user_reviews(lat, long)
      render json: reviews
    else
      render json: { error: 'User must be logged in' }, status: :unauthorized
      end
  end

end
