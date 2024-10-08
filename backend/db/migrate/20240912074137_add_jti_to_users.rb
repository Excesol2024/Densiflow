class AddJtiToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :jti, :string, null: false
    add_index :users, :jti, unique: true
    add_column :users, :password_key, :string
    add_column :users, :key_expires, :datetime
  end
end
