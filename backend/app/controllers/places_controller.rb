
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

  def places_types
    if current_user
      lat = current_user.lat
      long = current_user.long
      establishment_type = params[:establishment_type]
      google_service = Googleapi.new(nil)
      places = google_service.places_types(lat, long, establishment_type)
      render json: places
    else
      render json: { error: 'User must be logged in' }, status: :unauthorized
      end
  end

  def search_places
    if current_user
      query = params[:query]
      google_service = Googleapi.new(nil)
      places = google_service.fetch_places(query, current_user.lat, current_user.long)
      render json: places
    else
      render json: { error: 'User must be logged in' }, status: :unauthorized
      end
  end


  def suggested_places
    if current_user
      lat = current_user.lat
      long = current_user.long
      google_service = Googleapi.new(nil)
      places = google_service.suggested_places(lat, long)
      render json: places
    else
      render json: { error: 'User must be logged in' }, status: :unauthorized
      end
  end

  def find_place
    place_id = params[:query]
  
    if current_user
      # Check if the place exists in saved places, notifications, or reviews
      is_saved = current_user.savedplaces.exists?(placesID: place_id)
      is_in_notifications = current_user.notifications.exists?(placesID: place_id)
      is_reviewed = current_user.reviews.exists?(placeID: place_id)
  
      # Render the result
      render json: {
        status: "success",
        saved: is_saved,
        in_notifications: is_in_notifications,
        reviewed: is_reviewed,
      }, status: :ok
    else
      render json: { status: 'error', message: 'User not authenticated' }, status: :unauthorized
    end
  end




  # def sampleplaces_types
  #     lat = "14.59317224555505"
  #     long = "120.97440908060966"
  #     establishment_type = params[:establishment_type]
  #     google_service = Googleapi.new(nil)
  #     places = google_service.places_types(lat, long, establishment_type)
  #     render json: places

  # end

end
