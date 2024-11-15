class AddingPlaceIdToNotifications < ActiveRecord::Migration[7.1]
  def change
    add_column :notifications, :placesID, :string
  end
end
