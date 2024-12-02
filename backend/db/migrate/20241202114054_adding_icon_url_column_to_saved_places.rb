class AddingIconUrlColumnToSavedPlaces < ActiveRecord::Migration[7.1]
  def change
    add_column :savedplaces, :icon_url, :string
  end
end
