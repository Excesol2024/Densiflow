require 'net/http'
require 'json'

class Googleapi
  def initialize(api_key)
    @api_key = api_key || Rails.application.credentials[:google_api]
  end

  def recommended_places(lat, long)
    utc_time = Time.now.in_time_zone("Asia/Manila")
  
    # Check if the time is in the morning or PM
    establishment_type = utc_time.hour < 12 ? "cafe" : "restaurant"

    # Construct the API URL dynamically based on lat and long
    api_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{lat},#{long}&radius=2000&type=#{establishment_type}&key=#{@api_key}"
    
    # Create the URI object
    uri = URI(api_url)
  
    # Perform the HTTP GET request
    response = Net::HTTP.get(uri)
  
    # Parse the JSON response
    places = JSON.parse(response)
  
    # Extract the relevant information
    formatted_places = places["results"].map do |place|
      # Construct the photo URL if a photo reference exists
      photo_reference = place.dig("photos", 0, "photo_reference")
      photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : nil
      
      # place_id = place["place_id"]
      # # Fetch reviews for the place
      # reviews_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place_id}&fields=reviews&key=#{@api_key}"
      # reviews_response = Net::HTTP.get(URI(reviews_url))
      # reviews_data = JSON.parse(reviews_response)
  
      # # Extract reviews if available
      # reviews = reviews_data.dig("result", "reviews") || []
  
      # Determine the status based on user ratings total
      user_ratings_total = place["user_ratings_total"] || 0
      status = case user_ratings_total
               when 0..10
                 "low"
               when 11..20
                 "medium"
               else
                 "high"
               end
  
      {
        location: place.dig("geometry", "location"),
        icon: place["icon"],
        icon_background_color: place["icon_background_color"],
        icon_mask_base_uri: place["icon_mask_base_uri"],
        name: place["name"],
        opening_hours: place["opening_hours"],
        image_url: photo_url, 
        place_id: place["place_id"],
        rating: place["rating"],
        reference: place["reference"],
        user_ratings_total: user_ratings_total,
        vicinity: place["vicinity"],
        # reviews: reviews, 
        crowd_status: status,
        stablishment: utc_time
      }
    end
    
    formatted_places
  end

  def popular_places(lat, long)
    # Get the current local time in the Philippines
    utc_time = Time.now.in_time_zone("Asia/Manila")
  
    # Determine establishment type based on time of day
    establishment_type = utc_time.hour < 12 ? "cafe" : "restaurant"
  
    # Construct the API URL dynamically based on lat and long
    api_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{lat},#{long}&radius=2000&type=#{establishment_type}&key=#{@api_key}"
  
    # Create the URI object
    uri = URI(api_url)
  
    # Perform the HTTP GET request
    response = Net::HTTP.get(uri)
  
    # Parse the JSON response
    places = JSON.parse(response)
  
    # Extract and filter relevant information
    formatted_places = places["results"].map do |place|
      # Construct the photo URL if a photo reference exists
      photo_reference = place.dig("photos", 0, "photo_reference")
      photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : nil
      
      # Determine the user ratings total
      user_ratings_total = place["user_ratings_total"] || 0
  
      # Skip places with ratings less than or equal to 10
      next if user_ratings_total <= 5
  
      # Determine the crowd status based on user ratings total
      status = case user_ratings_total
               when 6..14
                 "LOW"
               when 15..25
                 "medium"
               else
                 "high"
               end
  
      {
        location: place.dig("geometry", "location"),
        icon: place["icon"],
        icon_background_color: place["icon_background_color"],
        icon_mask_base_uri: place["icon_mask_base_uri"],
        name: place["name"],
        opening_hours: place["opening_hours"],
        image_url: photo_url,
        place_id: place["place_id"],
        rating: place["rating"],
        reference: place["reference"],
        user_ratings_total: user_ratings_total,
        vicinity: place["vicinity"],
        crowd_status: status,
        establishment: utc_time  # Corrected variable name
      }
    end.compact  # Use compact to remove any nil values from the array
  
    formatted_places
  end



end
