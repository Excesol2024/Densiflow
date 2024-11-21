require_relative '../api/googleapi'

class ReviewsController < ApplicationController
  before_action :authenticate_user! 

  def random_user_reviews
    if current_user
      lat = current_user.lat
      long = current_user.long
      search_location = params[:location] # Location search parameter
  
      # Fetch reviews from the database
      db_reviews = Review.where("location ILIKE ?", "%#{search_location}%")
                         .order(created_at: :desc)
                         .map do |review|
        {
          name: review.location, # Assuming location acts as the establishment name
          place_id: nil,         # DB reviews might not have a Google Place ID
          location: { lat: lat, lng: long }, # Current user's lat and long
          reviewer_name: review.username,
          photo_url: review.photo_url,
          review_text: review.comments,
          date: review.created_at.strftime("%d %b")
        }
      end
  
      # Fetch Google reviews
      google_service = Googleapi.new(nil)
      google_reviews = google_service.user_reviews(lat, long)
  
      # Combine database and Google reviews
      combined_reviews = db_reviews + google_reviews
  
      # Render the combined reviews, database reviews first
      render json: combined_reviews
    else
      render json: { error: 'User must be logged in' }, status: :unauthorized
    end
  end


  def create
    if current_user
      review = Review.new(reviews_params)
      review.username = current_user.name 
      review.lat = current_user.lat
      review.long = current_user.long
      review.photo_url = current_user.photo_url

      if review.save
        render json: { message: 'Review created successfully', review: review }, status: :created
      else
        render json: { error: review.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'User must be logged in' }, status: :unauthorized
    end
  end

  private

  def reviews_params
    params.require(:review).permit(:comments, :location)
  end

  # create_table "reviews", force: :cascade do |t|
  #   t.string "username"
  #   t.string "comments"
  #   t.string "lat"
  #   t.string "long"
  #   t.string "location"
  #   t.string "photo_url"
  #   t.datetime "created_at", null: false
  #   t.datetime "updated_at", null: false
  # end

end
