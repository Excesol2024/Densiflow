class AddColumnToSavedPlaces < ActiveRecord::Migration[7.1]
  def change
    add_column :savedplaces, :place_name, :string
  end
end
