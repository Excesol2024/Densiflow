require_relative '../api/googleapi'
class SavedplacesController < ApplicationController
  before_action :authenticate_user!

  def create
    if current_user
      # Check if the place with the same placesID is already saved by the user
      if current_user.savedplaces.exists?(placesID: save_places_params[:placesID])
        render json: { status: "error", message: "Place already saved" }, status: :unprocessable_entity
      else
        saved_place = current_user.savedplaces.create(save_places_params)
        
        if saved_place.persisted?
          render json: { status: "success", message: "Successfully added place" }, status: :ok
        else
          render json: { status: 'error', message: 'Failed to save place', errors: saved_place.errors.full_messages }, status: :unprocessable_entity
        end
      end
    else
      render json: { status: 'error', message: 'User not authenticated' }, status: :unauthorized
    end
  end


  def delete_saved_place
    place_id = params[:query] 
    if current_user
      # Find the saved place by placesID and ensure it belongs to the current user
      saved_place = current_user.savedplaces.find_by(placesID: place_id)
      
      if saved_place
        saved_place.destroy
        render json: { status: "success", message: "Place successfully deleted" }, status: :ok
      else
        render json: { status: "error", message: "Place not found" }, status: :not_found
      end
    else
      render json: { status: 'error', message: 'User not authenticated' }, status: :unauthorized
    end
  end


  def find_place
    place_id = params[:query]
  
    if current_user
      # Find the saved place by place_id for the current user
      saved_place = current_user.savedplaces.find_by(placesID: place_id)
  
      if saved_place
        render json: { status: "success", place: saved_place }, status: :ok
      else
        render json: { status: "error", message: "Place not found" }, status: :ok
      end
    else
      render json: { status: 'error', message: 'User not authenticated' }, status: :unauthorized
    end
  end

  def user_savedplaces

    if current_user
      # Assuming the user has many saved places, you can retrieve them like this:
      saved_places = current_user.savedplaces
  
      # Render the saved places as JSON
      render json: saved_places, status: :ok
    else
      render json: { status: 'error', message: 'User not authenticated' }, status: :unauthorized
    end
  end

  def update_savedPlaces_crowdStatus
    if current_user
      lat = current_user.lat
      long = current_user.long
      saved_places = current_user.savedplaces
  
      # Initialize Google API service
      google_service = Googleapi.new(nil)
  
      updated_places = saved_places.map do |saved_place|
        # Fetch detailed place information for each saved place
        place_info = google_service.place_information(lat, long, saved_place.placesID)
        
        # Check if place information is available
        next unless place_info.present?
  
        # Update the saved place with crowd status or other fields
        saved_place.update(
          crowd_status: place_info[:crowd_status],
        )
          # Return updated saved place details with opening_hours
      {
        id: saved_place.id,
        name: place_info[:name],
        place_id: place_info[:place_id],
        crowd_status: place_info[:crowd_status],
        opening_hours: place_info[:opening_hours],
        address: place_info[:vicinity],
        kilometers: place_info[:kilometers],
        image_url: place_info[:image_url],
        lat: saved_place.lat,
        long: saved_place.long,
        created_at: saved_place.created_at.strftime('%Y-%m-%d %H:%M:%S')
      }
      end.compact
  
      render json: { status: 'success', updated_places: updated_places }, status: :ok
    else
      render json: { status: 'error', message: 'User not authenticated' }, status: :unauthorized
    end
  end

  private

  def save_places_params
    params.require(:savedplace).permit(:name, :address, :lat, :long, :crowd_status, :image_url, :placesID, :icon_url)
  end

end
