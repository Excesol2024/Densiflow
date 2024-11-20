class CreateReviews < ActiveRecord::Migration[7.1]
  def change
    create_table :reviews do |t|
      t.string :username
      t.string :comments
      t.string :lat 
      t.string :long
      t.string :location 
      t.string :photo_url
      t.timestamps
    end
  end
end
