class CreateSubscribeds < ActiveRecord::Migration[7.1]
  def change
    create_table :subscribeds do |t|
      t.string :email
      t.string :subscription_id
      t.timestamps
    end
  end
end
