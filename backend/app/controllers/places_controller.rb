
require_relative '../api/googleapi'

class PlacesController < ApplicationController

  def recommended
    lat = "8.120061470413162"
    long = "122.67032870723854  "
    google_service = Googleapi.new(nil)
    places = google_service.recommended_places(lat, long)
    render json: places
  end

  def popular
    lat = "8.120061470413162"
    long = "122.67032870723854  "
    google_service = Googleapi.new(nil)
    places = google_service.popular_places(lat, long)
    render json: places
  end

end
