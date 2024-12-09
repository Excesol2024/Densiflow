class CreateAppupdates < ActiveRecord::Migration[7.1]
  def change
    create_table :appupdates do |t|
      t.string :title
      t.text :descriptions
      t.string :notification_type
      t.references :user, null: false, foreign_key: true  
      t.timestamps
    end
  end
end
