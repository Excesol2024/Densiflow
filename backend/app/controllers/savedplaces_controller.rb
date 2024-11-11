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

  private

  def save_places_params
    params.require(:savedplace).permit(:name, :address, :lat, :long, :crowd_status, :image_url, :placesID)
  end

end
