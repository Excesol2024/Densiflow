class SavedplacesController < ApplicationController
  before_action :authenticate_user!

  def create
    if current_user
      saved_place = current_user.savedplaces.create(save_places_params)
      
      if saved_place.persisted?
        render json: { status: "success", message: "Successfully added place" } status: :ok
      else
        render json: { status: 'error', message: 'Failed to save place', errors: saved_place.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { status: 'error', message: 'User not authenticated' }, status: :unauthorized
    end
  end

  private

  def save_places_params
    params.require(:savedplace).permit(:name, :address, :lat, :long, :crowd_status, :image_url)
  end

end
