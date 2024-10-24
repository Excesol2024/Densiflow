
require_relative '../api/googleapi'

class PlacesController < ApplicationController
  before_action :authenticate_user!

  def recommended
    if current_user
    lat = current_user.lat
    long = current_user.long
    google_service = Googleapi.new(nil)
    places = google_service.recommended_places(lat, long)
    render json: places
  else
    render json: { error: 'User must be logged in' }, status: :unauthorized
    end
  end

  def popular
    if current_user
      lat = current_user.lat
      long = current_user.long
      google_service = Googleapi.new(nil)
      places = google_service.popular_places(lat, long)
      render json: places
    else
      render json: { error: 'User must be logged in' }, status: :unauthorized
      end
  end

end
