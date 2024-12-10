class AddColumnPlaceNameToReviews < ActiveRecord::Migration[7.1]
  def change
    add_column :reviews, :place_name, :string
    add_reference :reviews, :user, null: false, foreign_key: true
  end
end
