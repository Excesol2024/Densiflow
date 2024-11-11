# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_11_08_110448) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "notifications", force: :cascade do |t|
    t.string "lat"
    t.string "long"
    t.string "name"
    t.string "crowd_status"
    t.datetime "scheduled_time"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "pendings", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password"
    t.string "otp"
    t.datetime "otp_expires"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "savedplaces", force: :cascade do |t|
    t.string "name"
    t.string "address"
    t.string "lat"
    t.string "long"
    t.string "crowd_status"
    t.string "image_url"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "placesID"
    t.index ["user_id"], name: "index_savedplaces_on_user_id"
  end

  create_table "subscribeds", force: :cascade do |t|
    t.string "email"
    t.string "subscription_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.string "jti", null: false
    t.string "password_key"
    t.datetime "key_expires"
    t.string "expo_token"
    t.string "firebase_token"
    t.string "lat"
    t.string "long"
    t.string "photo_url"
    t.string "gender"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "notifications", "users"
  add_foreign_key "savedplaces", "users"
end
