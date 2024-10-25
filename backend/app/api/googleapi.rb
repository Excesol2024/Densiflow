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
      status = case user_ratings_total
               when 0..10
                 "low"
               when 11..20
                 "medium"
               else
                 "high"
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
        crowd_status: status,
        stablishment: utc_time,
        kilometers: distance.round(2)
      }
    end.compact  # Removes any nil values from the array
    
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
  
    # Extract and format the relevant information
    formatted_places = places["results"].map do |place|
      # Get the place's location
      place_location = place.dig("geometry", "location")
      place_lat = place_location["lat"]
      place_lng = place_location["lng"]
  
      # Calculate distance from the user's location to the place
      distance = haversine_distance(lat, long, place_lat, place_lng)
  
      # Extract photo URL if a photo reference exists
      photo_reference = place.dig("photos", 0, "photo_reference")
      photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : nil
  
      # Determine the user ratings total
      user_ratings_total = place["user_ratings_total"] || 0
  
      # Skip places with ratings less than or equal to 5
      next if user_ratings_total <= 5
  
      # Determine the crowd status based on user ratings total
      status = case user_ratings_total
               when 6..14
                 "low"
               when 15..25
                 "medium"
               else
                 "high"
               end
  
      # Return the formatted place data
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
        establishment: utc_time,
        kilometers: distance.round(2)  # Add the distance in kilometers, rounded to 2 decimal places
      }
    end
  
    # Filter out nil values (from skipped places)
    formatted_places.compact
  end


  def places_types(lat, long, establishment_type)
  

     api_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{lat},#{long}&radius=2000&type=#{establishment_type}&key=#{@api_key}"
     uri = URI(api_url)
    
     # Perform the HTTP GET request
     response = Net::HTTP.get(uri)
     
     # Parse the JSON response
     places = JSON.parse(response)

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
      status = case user_ratings_total
               when 0..10
                 "low"
               when 11..20
                 "medium"
               else
                 "high"
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
        crowd_status: status,
        kilometers: distance.round(2)
      }
    end.compact  # Removes any nil values from the array
    
    formatted_places

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
