class AddingPlacesIdInSavedPlaces < ActiveRecord::Migration[7.1]
  def change
    add_column :savedplaces, :placesID, :string
  end
end
