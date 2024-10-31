require 'net/http'
require 'json'

class Googleapi
  def initialize(api_key)
    @api_key = api_key || Rails.application.credentials[:google_api]
  end


  def recommended_places(lat, long)
    establishment_types = ["cafe", "park", "hotels"]
    
    # Get the current time in seconds since the epoch in UTC
    current_time_utc = Time.now.to_i
    # Adjust for the Philippines time zone (UTC+8)
    current_time_philippines = current_time_utc + 8 * 60 * 60
    
    # Collect all places for the specified establishment types
    all_places = establishment_types.flat_map do |establishment_type|
      # Construct the API URL dynamically based on lat, long, and establishment type
      api_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{lat},#{long}&radius=2000&type=#{establishment_type}&key=#{@api_key}"
      
      # Create the URI object
      uri = URI(api_url)
      
      # Perform the HTTP GET request
      response = Net::HTTP.get(uri)
      
      # Parse the JSON response
      places = JSON.parse(response)["results"]
  
      # Extract and format the relevant information
      places.map do |place|
        place_location = place.dig("geometry", "location")
        place_lat = place_location["lat"]
        place_lng = place_location["lng"]
        distance = haversine_distance(lat, long, place_lat, place_lng)
  
        photo_reference = place.dig("photos", 0, "photo_reference")
        photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : nil
        
        # Skip the place if there is no photo URL
        next if photo_url.nil?
  
        user_ratings_total = place["user_ratings_total"] || 0
        next if user_ratings_total <= 0 # Skip places with no ratings
  
        # Initialize reviews to nil
        reviews = nil
        
        # If the place ID is available, fetch detailed place info for reviews
        if place["place_id"]
          details_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place['place_id']}&key=#{@api_key}"
          details_response = Net::HTTP.get(URI(details_url))
          details = JSON.parse(details_response)
  
          # Check if reviews are available and extract them
          reviews = details.dig("result", "reviews") if details.dig("result", "reviews")
        end
  
        # Count recent reviews (e.g., within the last 1 hour in PH time)
        recent_reviews = reviews&.select do |review|
          review_time_utc = review["time"]
          # Convert review time to Philippine time
          review_time_philippines = review_time_utc + 8 * 60 * 60
  
          # Check if the review was made within the last 1 hour
          (current_time_philippines - review_time_philippines) <= 60 * 60 # 1 hour in seconds
        end || []
  
        # Determine crowd status based on user_ratings_total and recent reviews
        crowd_status = case
                       when user_ratings_total > 30 && recent_reviews.any?
                         "high" # More than 30 total ratings and at least one recent review
                       when user_ratings_total.between?(15, 30) && recent_reviews.any?
                         "medium" # Between 15 and 30 total ratings and at least one recent review
                       else
                         "low" # Less than 15 total ratings or no recent reviews
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
          crowd_status: crowd_status,
          kilometers: distance.round(2),
          reviews: reviews # Include reviews in the output
        }
      end.compact # Remove nil values
    end
  
    # Return nil if no places are found
    return nil if all_places.empty?
  
    # Return all the filtered places combined from each establishment type
    all_places
  end
  
  
  def popular_places(lat, long)
    establishment_types = ["restaurant", "cafe"]
  
    # Get the current time in seconds since the epoch in UTC
    current_time_utc = Time.now.to_i
    # Adjust for the Philippines time zone (UTC+8)
    current_time_philippines = current_time_utc + 8 * 60 * 60
  
    # Collect all places for the specified establishment types
    all_places = establishment_types.flat_map do |establishment_type|
      # Construct the API URL dynamically based on lat, long, and establishment type
      api_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{lat},#{long}&radius=2000&type=#{establishment_type}&key=#{@api_key}"
      
      # Create the URI object
      uri = URI(api_url)
      
      # Perform the HTTP GET request
      response = Net::HTTP.get(uri)
      
      # Parse the JSON response
      places = JSON.parse(response)["results"]
  
      # Extract and format the relevant information
      places.map do |place|
        place_location = place.dig("geometry", "location")
        place_lat = place_location["lat"]
        place_lng = place_location["lng"]
        distance = haversine_distance(lat, long, place_lat, place_lng)
        
        photo_reference = place.dig("photos", 0, "photo_reference")
        photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : nil
        
        # Skip the place if there is no photo URL
        next if photo_url.nil?
  
        user_ratings_total = place["user_ratings_total"] || 0
        next if user_ratings_total <= 0 # Skip places with no ratings
        
        # Initialize reviews to nil
        reviews = nil
        
        # If the place ID is available, fetch detailed place info for reviews
        if place["place_id"]
          details_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place['place_id']}&key=#{@api_key}"
          details_response = Net::HTTP.get(URI(details_url))
          details = JSON.parse(details_response)
          
          # Check if reviews are available and extract them
          reviews = details.dig("result", "reviews") if details.dig("result", "reviews")
        end
  
        # Count recent reviews (e.g., within the last 1 hour in PH time)
        recent_reviews = reviews&.select do |review|
          review_time_utc = review["time"]
          # Convert review time to Philippine time
          review_time_philippines = review_time_utc + 8 * 60 * 60
          
          # Check if the review was made within the last 1 hour
          (current_time_philippines - review_time_philippines) <= 60 * 60 # 1 hour in seconds
        end || []
  
        # Determine crowd status based on user_ratings_total and recent reviews
        crowd_status = case
                       when user_ratings_total > 30 && recent_reviews.any?
                         "high" # More than 30 total ratings and at least one recent review
                       when user_ratings_total.between?(15, 30) && recent_reviews.any?
                         "medium" # Between 15 and 30 total ratings and at least one recent review
                       else
                         "low" # Less than 15 total ratings or no recent reviews
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
          crowd_status: crowd_status,
          kilometers: distance.round(2),
          reviews: reviews # Include reviews in the output
        }
      end.compact # Remove nil values
    end
  
    # Return nil if no places are found
    return nil if all_places.empty?
  
    # Return all the filtered places combined from each establishment type
    all_places
  end
  

  def places_types(lat, long, establishment_type)
    api_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{lat},#{long}&radius=2000&type=#{establishment_type}&key=#{@api_key}"
    uri = URI(api_url)
  
    # Perform the HTTP GET request
    response = Net::HTTP.get(uri)
    
    # Parse the JSON response
    places = JSON.parse(response)
  
    custom_icons = {
      "amusement_park" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FPark%20(2).png?alt=media&token=152a250b-d45e-46be-b81c-dedaa13bdd5d",
      "aquarium" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FAquarium.png?alt=media&token=431927fa-a03d-454f-a143-53cd5614ad45",
      "art_gallery" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FArt_Gallery.png?alt=media&token=8b0b8a66-dc9c-4274-9bee-3dced6953b63",
      # ... (other icons)
      "zoo" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FZoo.png?alt=media&token=e5039442-3e27-488d-8d2b-102459ac7f31"
    }
  
    # Extract the relevant information
    formatted_places = places["results"].map do |place|
      place_location = place.dig("geometry", "location")
      place_lat = place_location["lat"]
      place_lng = place_location["lng"]
  
      # Calculate distance from the user's location to the place
      distance = haversine_distance(lat, long, place_lat, place_lng)
  
      # Construct the photo URL if a photo reference exists
      photo_reference = place.dig("photos", 0, "photo_reference")
      photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : nil
  
      # Skip the place if there is no photo URL
      next if photo_url.nil?
  
      user_ratings_total = place["user_ratings_total"] || 0
      latest_review_time = place["reviews"]&.dig(0, "time") # Assuming reviews are sorted with the latest first
      crowd_status = "low" # Default status
  
      # Check if the latest review is within the last hour
      if latest_review_time
        latest_review_timestamp = Time.at(latest_review_time)
        if Time.now - latest_review_timestamp < 3600 # 3600 seconds = 1 hour
          if user_ratings_total > 30
            crowd_status = "high"
          elsif user_ratings_total > 15
            crowd_status = "medium"
          end
        end
      end
  
      icon_url = custom_icons[establishment_type] || place["icon"]
  
      {
        location: place_location,
        icon: icon_url,
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
        crowd_status: crowd_status,
        kilometers: distance.round(2)
      }
    end.compact  # Removes any nil values from the array
    
    formatted_places
  end
  
  def suggested_places(lat, long)
    # Get the current time in seconds since the epoch in UTC
    current_time_utc = Time.now.to_i
    # Adjust for the Philippines time zone (UTC+8)
    current_time_philippines = current_time_utc + 8 * 60 * 60
  
    # Determine establishment type based on the time of day
    utc_time = Time.now.in_time_zone("Asia/Manila")
    establishment_type = utc_time.hour < 12 ? "cafe" : "restaurant"
  
    # Construct the API URL dynamically based on lat and long
    api_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{lat},#{long}&radius=2000&type=#{establishment_type}&key=#{@api_key}"
  
    # Create the URI object
    uri = URI(api_url)
  
    # Perform the HTTP GET request
    response = Net::HTTP.get(uri)
  
    # Parse the JSON response
    places = JSON.parse(response)["results"]
  
    # Extract the relevant information
    formatted_places = places.map do |place|
      place_location = place.dig("geometry", "location")
      place_lat = place_location["lat"]
      place_lng = place_location["lng"]
  
      # Calculate distance from the user's location to the place
      distance = haversine_distance(lat, long, place_lat, place_lng)
  
      # Construct the photo URL if a photo reference exists
      photo_reference = place.dig("photos", 0, "photo_reference")
      photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : nil
  
      # Skip the place if there is no photo URL
      next if photo_url.nil?
  
      user_ratings_total = place["user_ratings_total"] || 0
      next if user_ratings_total <= 0 # Skip places with no ratings
  
      # Initialize reviews to nil
      reviews = nil
  
      # If the place ID is available, fetch detailed place info for reviews
      if place["place_id"]
        details_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place['place_id']}&key=#{@api_key}"
        details_response = Net::HTTP.get(URI(details_url))
        details = JSON.parse(details_response)
  
        # Check if reviews are available and extract them
        reviews = details.dig("result", "reviews") if details.dig("result", "reviews")
      end
  
      # Count recent reviews (e.g., within the last 1 hour in PH time)
      recent_reviews = reviews&.select do |review|
        review_time_utc = review["time"]
        # Convert review time to Philippine time
        review_time_philippines = review_time_utc + 8 * 60 * 60
  
        # Check if the review was made within the last 1 hour
        (current_time_philippines - review_time_philippines) <= 60 * 60 # 1 hour in seconds
      end || []
  
      # Determine crowd status based on user_ratings_total and recent reviews
      crowd_status = case
                     when user_ratings_total > 30 && recent_reviews.any?
                       "high" # More than 30 total ratings and at least one recent review
                     when user_ratings_total.between?(15, 30) && recent_reviews.any?
                       "medium" # Between 15 and 30 total ratings and at least one recent review
                     else
                       "low" # Less than 15 total ratings or no recent reviews
                     end
  
      {
        location: place_location,
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
        crowd_status: crowd_status,
        establishment: utc_time, # Keep track of the establishment time
        kilometers: distance.round(2)
      }
    end.compact  # Removes any nil values from the array
  
    formatted_places
  end


  def fetch_places(query)
    return [] if query.blank?
  
    api_url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=#{query}&key=#{@api_key}"
    uri = URI(api_url)
  
    begin
      # Perform the HTTP GET request
      response = Net::HTTP.get(uri)
      # Parse the JSON response
      places = JSON.parse(response)
  
      formatted_places = places["predictions"].map do |place|
        place_id = place["place_id"]
        place_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place_id}&key=#{@api_key}"
        place_uri = URI(place_url)
        details_response = Net::HTTP.get(place_uri)
        place_details = JSON.parse(details_response)
  
        result = place_details["result"]
        {
          name: place["description"],
          place_id: place["place_id"],
          location: result.dig("geometry", "location")
        }
      end
  
      formatted_places
    rescue StandardError => e
      # Log the error and return an empty array or handle it as needed
      puts "Error fetching places: #{e.message}"
      []
    end
  end


  def place_information(lat, long, place_id)
    return [] if place_id.blank?
  
    api_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place_id}&key=#{@api_key}"
    uri = URI(api_url)
  
    begin
      # Perform the HTTP GET request
      response = Net::HTTP.get(uri)
      # Parse the JSON response
      places = JSON.parse(response)
  
      formatted_places = places["result"].map do |place|

        place_location = place.dig("geometry", "location")
        place_lat = place_location["lat"]
        place_lng = place_location["lng"]
        distance = haversine_distance(lat, long, place_lat, place_lng)

        {
          location: place.dig("geometry", "location"),
          name: place["name"],
          place_id: place_id,
           kilometers: distance.round(2)
        }
      end
      
      formatted_places
    rescue StandardError => e
      # Log the error and return an empty array or handle it as needed
      puts "Error fetching places: #{e.message}"
      []
    end
  end
  
  
  private 

  def haversine_distance(lat1, lon1, lat2, lon2)
    # Convert values to floats to avoid string coercion errors
    lat1 = lat1.to_f
    lon1 = lon1.to_f
    lat2 = lat2.to_f
    lon2 = lon2.to_f
  
    rad_per_deg = Math::PI / 180  # PI / 180
    rkm = 6371                    # Earth radius in kilometers
    dlat_rad = (lat2 - lat1) * rad_per_deg  # Delta, converted to rad
    dlon_rad = (lon2 - lon1) * rad_per_deg
  
    lat1_rad = lat1 * rad_per_deg
    lat2_rad = lat2 * rad_per_deg  # Define lat2_rad here
  
    a = Math.sin(dlat_rad / 2)**2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(dlon_rad / 2)**2
    c = 2 * Math::atan2(Math::sqrt(a), Math::sqrt(1 - a))
  
    rkm * c # Distance in kilometers
  end
  


end
