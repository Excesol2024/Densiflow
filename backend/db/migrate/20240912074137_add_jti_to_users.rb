class AddJtiToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :name, :string
    add_column :users, :jti, :string, null: false
    add_index :users, :jti, unique: true
    add_column :users, :password_key, :string
    add_column :users, :key_expires, :datetime
    add_column :users, :expo_token, :string
    add_column :users, :firebase_token, :string
    add_column :users, :lat, :string
    add_column :users, :long, :string
    add_column :users, :photo_url, :string
  end
end
