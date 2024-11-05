class CreateSavedplaces < ActiveRecord::Migration[7.1]
  def change
    create_table :savedplaces do |t|
      t.string :name
      t.string :address
      t.string :lat
      t.string :long
      t.string :crowd_status
      t.string :image_url
      t.references :user, null: false, foreign_key: true  
      
      t.timestamps
    end
  end
end
