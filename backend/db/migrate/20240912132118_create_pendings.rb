class CreatePendings < ActiveRecord::Migration[7.1]
  def change
    create_table :pendings do |t|
      t.string :name
      t.string :email
      t.string :password
      t.string :otp
      t.datetime :otp_expires
      t.timestamps
    end
  end
end
