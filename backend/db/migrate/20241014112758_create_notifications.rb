class CreateNotifications < ActiveRecord::Migration[7.1]
  def change
    create_table :notifications do |t|
      t.string :lat
      t.string :long
      t.string :name
      t.time :scheduled_time
      t.references :user, null: false, foreign_key: true  
      t.timestamps
    end
  end
end
