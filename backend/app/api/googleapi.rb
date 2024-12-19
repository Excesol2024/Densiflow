require 'net/http'
require 'json'
require 'date'

class Googleapi
  def initialize(api_key)
    @api_key = api_key || Rails.application.credentials[:google_api]
  end

  BANNER = "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/415277-PDUGAF-998.jpg?alt=media&token=0a9cf82f-80d2-4555-befa-aa8c65a960e9"
  CUSTOM_IMAGE_URL = "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/2208.i203.051.S.m004.c13.restaurant%20bar%20cafe%20furniture%20interior%20cartoon.jpg?alt=media&token=96c0d3f3-bbb9-445f-a685-dd3f277cd414"

  def recommended_places(lat, long)
    establishment_types = ["cafe", "park"]
  
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
        photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : BANNER
        
        # Skip the place if there is no photo URL
        next if photo_url.nil?
  
        user_ratings_total = place["user_ratings_total"] || 0
        next if user_ratings_total <= 0 # Skip places with no ratings
  
        # Initialize reviews to nil
        reviews = []
        
        # If the place ID is available, fetch detailed place info for reviews
        if place["place_id"]
          details_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place['place_id']}&key=#{@api_key}"
          details_response = Net::HTTP.get(URI(details_url))
          details = JSON.parse(details_response)
  
          # Check if reviews are available and extract them
         
          reviews = details.dig("result", "reviews") || []
          photos = details.dig("result", "photos") || []
          photo_count = photos.length
          photo_url = CUSTOM_IMAGE_URL if photo_count <= 2
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
                       when user_ratings_total > 60 && recent_reviews.any?
                         "high" # More than 30 total ratings and at least one recent review
                       when user_ratings_total.between?(25, 50) && recent_reviews.any?
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
          opening_hours: details.dig("result", "opening_hours"),
          image_url: photo_url,
          place_id: place["place_id"],
          rating: place["rating"],
          reference: place["reference"],
          user_ratings_total: user_ratings_total,
          vicinity: place["vicinity"],
          crowd_status: crowd_status,
          kilometers: distance.round(2),
          reviews: reviews
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
        photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : BANNER
  
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
          reviews = details.dig("result", "reviews") || []
          photos = details.dig("result", "photos") || []
          photo_count = photos.length
          photo_url = CUSTOM_IMAGE_URL if photo_count <= 2
        end
  
        # Get the current UTC time and day of the week
        utc_time = Time.now.utc
        current_hour = utc_time.hour
        day_of_week = utc_time.wday
  
        # Determine if it's peak hour for specific establishment types
        is_peak_hour = case establishment_type
                       when "cafe"
                         (7..10).cover?(current_hour)
                       when "restaurant"
                         (11..14).cover?(current_hour) || (18..21).cover?(current_hour)
                       else
                         false
                       end
  
        # Check if it's the weekend (Saturday or Sunday)
        is_weekend = day_of_week == 0 || day_of_week == 6
  
        # Base crowd status based on user ratings total
        base_crowd = case user_ratings_total
                when 0..29 then "low"
                when 30..50 then "medium"
                when 51..100 then "high"
                else "high"
                end

        # Adjust crowd status based on peak hour or weekend
        adjusted_crowd = case base_crowd
                 when "low" then is_peak_hour && is_weekend ? "medium" : "low"
                 when "medium" then is_peak_hour ? "medium" : "medium"
                when "high" then (is_peak_hour && is_weekend) ? "high" : "high"
                 else base_crowd
                end
  
        # If there are 5 or more recent reviews, increase the crowd status
        # if reviews&.count.to_i >= 5
        #   case adjusted_crowd
        #   when "low" then "medium"
        #   when "medium" then "high"
        #   when "high" then "high"
        #   else adjusted_crowd
        #   end
        # else
        #   adjusted_crowd
        # end
  
        # Count recent reviews (e.g., within the last 1 hour in PH time)
        recent_reviews = reviews&.select do |review|
          review_time_utc = review["time"]
          # Convert review time to Philippine time
          review_time_philippines = review_time_utc + 8 * 60 * 60
  
          # Check if the review was made within the last 1 hour
          (current_time_philippines - review_time_philippines) <= 60 * 60 # 1 hour in seconds
        end || []
  
        {
          location: place.dig("geometry", "location"),
          icon: place["icon"],
          icon_background_color: place["icon_background_color"],
          icon_mask_base_uri: place["icon_mask_base_uri"],
          name: place["name"],
          opening_hours: details.dig("result", "opening_hours"),
          image_url: photo_url,
          place_id: place["place_id"],
          rating: place["rating"],
          reference: place["reference"],
          user_ratings_total: user_ratings_total,
          vicinity: place["vicinity"],
          crowd_status: adjusted_crowd,
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
  
    # Extract the relevant information
    formatted_places = places["results"].map do |place|
      place_location = place.dig("geometry", "location")
      place_lat = place_location["lat"]
      place_lng = place_location["lng"]
  
      # Calculate distance from the user's location to the place
      distance = haversine_distance(lat, long, place_lat, place_lng)
  
      # Construct the photo URL if a photo reference exists
      photo_reference = place.dig("photos", 0, "photo_reference")
      photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : BANNER
  
      # Skip the place if there is no photo URL
      next if photo_url.nil?
  
      user_ratings_total = place["user_ratings_total"] || 0
      latest_review_time = place["reviews"]&.dig(0, "time") # Assuming reviews are sorted with the latest first
      crowd_status = "low" # Default status
  
      # Get the current UTC time and day of the week
      utc_time = Time.now.utc
      current_hour = utc_time.hour
      day_of_week = utc_time.wday
  
      # Determine if it's peak hour for specific establishment types
      is_peak_hour = case establishment_type
                     when "cafe"
                       (7..10).cover?(current_hour)
                     when "restaurant"
                       (11..14).cover?(current_hour) || (18..21).cover?(current_hour)
                     else
                       false
                     end
  
      # Check if it's the weekend (Saturday or Sunday)
      is_weekend = day_of_week == 0 || day_of_week == 6
  
      # Base crowd status based on user ratings total
      base_crowd = case user_ratings_total
                   when 0..29 then "low"
                   when 30..50 then "medium"
                   when 51..100 then "high"
                   else "high"
                   end
  
      # Adjust crowd status based on peak hour or weekend
      adjusted_crowd = case base_crowd
                       when "low" then is_peak_hour && is_weekend ? "medium" : "low"
                       when "medium" then is_peak_hour ? "medium" : "medium"
                       when "high" then (is_peak_hour && is_weekend) ? "high" : "high"
                       else base_crowd
                       end
  
  
      if place["place_id"]
        details_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place['place_id']}&key=#{@api_key}"
        details_response = Net::HTTP.get(URI(details_url))
        details = JSON.parse(details_response)
  
        types = details.dig("result", "types") || []
        photos = details.dig("result", "photos") || []
        photo_count = photos.length
        photo_url = photo_count <= 2 ? CUSTOM_IMAGE_URL : photo_url # Set custom image if photo count <= 2
      end
  
      next unless types.include?(establishment_type)
  
      icon_url = custom_icons[establishment_type] || place["icon"]
  
      {
        location: place_location,
        icon: icon_url,
        icon_background_color: place["icon_background_color"],
        icon_mask_base_uri: place["icon_mask_base_uri"],
        name: place["name"],
        opening_hours: details.dig("result", "opening_hours"),
        image_url: photo_url,
        place_id: place["place_id"],
        rating: place["rating"],
        reference: place["reference"],
        user_ratings_total: user_ratings_total,
        vicinity: place["vicinity"],
        crowd_status: adjusted_crowd,
        kilometers: distance.round(2),
        count: photo_count
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
    
    # Create the URI object and fetch data
    response = Net::HTTP.get(URI(api_url))
    places = JSON.parse(response)["results"] || []
  
    # Process places
    formatted_places = places.map do |place|
      place_location = place.dig("geometry", "location")
      place_lat = place_location["lat"]
      place_lng = place_location["lng"]
  
      # Calculate distance
      distance = haversine_distance(lat, long, place_lat, place_lng)
  
      # Photo URL handling
      photo_reference = place.dig("photos", 0, "photo_reference")
      photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : BANNER
  
      user_ratings_total = place["user_ratings_total"] || 0
      next if user_ratings_total <= 0
  
      reviews = []
      if place["place_id"]
        details_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place['place_id']}&key=#{@api_key}"
        details_response = Net::HTTP.get(URI(details_url))
        details = JSON.parse(details_response)
  
        # Fetch reviews and photos
        reviews = details.dig("result", "reviews") || []
        photo_count = details.dig("result", "photos")&.length || 0
        photo_url = CUSTOM_IMAGE_URL if photo_count <= 2
      end
  
      # Recent reviews
      recent_reviews = reviews.select do |review|
        review_time_philippines = review["time"] + 8 * 60 * 60
        current_time_philippines - review_time_philippines <= 60 * 60
      end
  
      # Determine crowd status
      crowd_status = begin
        current_hour = utc_time.hour
        day_of_week = utc_time.wday
        is_peak_hour = if establishment_type == "cafe"
                         (7..10).cover?(current_hour)
                       elsif establishment_type == "restaurant"
                         (11..14).cover?(current_hour) || (18..21).cover?(current_hour)
                       else
                         false
                       end
        is_weekend = day_of_week == 0 || day_of_week == 6
        
        base_crowd = case user_ratings_total
                     when 0..29 then "low"
                     when 30..50 then "medium"
                     when 51..100 then "high"
                     else "high"
                     end
        adjusted_crowd = if base_crowd == "low" && (is_peak_hour && is_weekend)
                           "medium"
                         elsif base_crowd == "medium" && is_peak_hour
                           "medium"
                         elsif base_crowd == "high" && is_peak_hour && is_weekend
                           "high"
                         else
                           base_crowd
                         end

        if recent_reviews.count >= 5
          case adjusted_crowd
          when "low" then "medium"
          when "medium" then "high"
          when "high" then "high"
          else adjusted_crowd
          end
        else
          adjusted_crowd
        end
      end
  
      {
        location: place_location,
        icon: place["icon"],
        icon_background_color: place["icon_background_color"],
        icon_mask_base_uri: place["icon_mask_base_uri"],
        name: place["name"],
        opening_hours: details.dig("result", "opening_hours"),
        image_url: photo_url,
        place_id: place["place_id"],
        rating: place["rating"],
        reference: place["reference"],
        user_ratings_total: user_ratings_total,
        vicinity: place["vicinity"],
        crowd_status: crowd_status,
        establishment: utc_time,
        kilometers: distance.round(2)
      }
    end.compact
  
    formatted_places
  end
  
  


  def fetch_places(query, lat, long)
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
        
        photos = result["photos"] || []
        photo_count = photos.length

        place_location = result.dig("geometry", "location")
        place_lat = place_location["lat"]
        place_lng = place_location["lng"]
        distance = haversine_distance(lat, long, place_lat, place_lng)
        # Determine photo_url based on photo_count
        if photo_count > 2
          photo_reference = photos.first["photo_reference"]
          photo_url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}"
        else
          photo_url = CUSTOM_IMAGE_URL  # Use default image if photo count is <= 2
        end
  
        # Extract type information and check for 'establishment'
        types = result["types"] || []
        is_establishment = types.include?("establishment")
  
        # Skip places that are not an establishment
        next unless is_establishment
  
        # Extract reviews
        reviews = result["reviews"] || []
        reviews_count = reviews.size
        recent_reviews = reviews.select do |review|
          review_time_utc = review["time"]
          review_time_philippines = review_time_utc + 8 * 60 * 60
          # Consider review as recent if within the last 1 hour
          (Time.now.to_i + 8 * 60 * 60 - review_time_philippines) <= 60 * 60
        end
  
        # Determine crowd status based on user ratings and recent reviews
        user_ratings_total = result["user_ratings_total"] || 0
  
        # Get the current UTC time and day of the week
        utc_time = Time.now.utc
        current_hour = utc_time.hour
        day_of_week = utc_time.wday
  
        # Determine if it's peak hour for specific establishment types
        establishment_type = result["types"].include?("cafe") ? "cafe" : (result["types"].include?("restaurant") ? "restaurant" : "other")
        is_peak_hour = if establishment_type == "cafe"
                         (7..10).cover?(current_hour)
                       elsif establishment_type == "restaurant"
                         (11..14).cover?(current_hour) || (18..21).cover?(current_hour)
                       else
                         false
                       end
        is_weekend = day_of_week == 0 || day_of_week == 6
  
        # Base crowd status based on user ratings total
        base_crowd = case user_ratings_total
                    when 0..29 then "low"
                    when 30..50 then "medium"
                    when 51..100 then "high"
                    else "high"
                    end
  
        # Adjust crowd status based on peak hour or weekend
        adjusted_crowd = if base_crowd == "low" && (is_peak_hour && is_weekend)
          "medium"
        elsif base_crowd == "medium" && is_peak_hour
          "medium"
        elsif base_crowd == "high" && is_peak_hour && is_weekend
          "high"
        else
          base_crowd
        end
  
        # If there are 5 or more recent reviews, increase the crowd status
        if recent_reviews.count >= 5
          case adjusted_crowd
          when "low" then "medium"
          when "medium" then "high"
          when "high" then "high"
          else adjusted_crowd
          end
        else
          adjusted_crowd
        end
  
        # Return the place only if it is an establishment
        {
          location: place_location,
          name: place.dig("structured_formatting", "main_text"),
          image_url: photo_url,
          subname: place["description"],
          place_id: place["place_id"],
          location: result.dig("geometry", "location"),
          types: types,
          is_establishment: is_establishment,
          crowd_status: adjusted_crowd,
          reviews_count: reviews_count,
          recent_reviews: recent_reviews,
          rating: result["rating"],
          user_ratings_total: user_ratings_total,
          photo_count: photo_count,
          opening_hours: result["opening_hours"],
          vicinity: result["vicinity"],
          kilometers: distance.round(2),
        }
      end
  
      # Filter out nil results (places that are not establishments)
      formatted_places.compact
  
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
      place_details = JSON.parse(response)["result"]
  
      return [] if place_details.nil?
  
      # Extract necessary data
      place_location = place_details.dig("geometry", "location")
      place_lat = place_location["lat"]
      place_lng = place_location["lng"]
      distance = haversine_distance(lat, long, place_lat, place_lng)
  
      # Extract reviews and determine recent ones
      reviews = place_details["reviews"] || []
      current_time_philippines = Time.now.to_i + 8 * 60 * 60
      recent_reviews = reviews.select do |review|
        review_time_philippines = review["time"] + 8 * 60 * 60
        (current_time_philippines - review_time_philippines) <= 60 * 60
      end
  
      user_ratings_total = place_details["user_ratings_total"] || 0
  
      # Get the current UTC time and day of the week
      utc_time = Time.now.utc
      current_hour = utc_time.hour
      day_of_week = utc_time.wday
  
      # Determine if it's peak hour for specific establishment types
      types = place_details["types"] || []
      establishment_type = types.include?("cafe") ? "cafe" : (types.include?("restaurant") ? "restaurant" : "other")
      is_peak_hour = if establishment_type == "cafe"
                       (7..10).cover?(current_hour)
                     elsif establishment_type == "restaurant"
                       (11..14).cover?(current_hour) || (18..21).cover?(current_hour)
                     else
                       false
                     end
      is_weekend = day_of_week == 0 || day_of_week == 6
  
      # Base crowd status based on user ratings total
      base_crowd = case user_ratings_total
                    when 0..29 then "low"
                    when 30..50 then "medium"
                    when 51..100 then "high"
                    else "high"
                    end
  
      # Adjust crowd status based on peak hour or weekend
      adjusted_crowd = if base_crowd == "low" && (is_peak_hour && is_weekend)
                  "medium"
                elsif base_crowd == "medium" && is_peak_hour
                  "medium"
                elsif base_crowd == "high" && is_peak_hour && is_weekend
                  "high"
                else
                  base_crowd
                end
  
      # If there are 5 or more recent reviews, increase the crowd status
      if recent_reviews.count >= 5
        case adjusted_crowd
        when "low" then "medium"
        when "medium" then "high"
        when "high" then "high"
        else adjusted_crowd
        end
      else
        adjusted_crowd
      end
  
      # Photo URL
      photo_reference = place_details.dig("photos", 0, "photo_reference")
      photo_url = photo_reference ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{@api_key}" : nil
  
      # Return formatted data
      {
        location: place_location,
        name: place_details["name"],
        place_id: place_id,
        opening_hours: place_details["opening_hours"],
        vicinity: place_details["vicinity"],
        rating: place_details["rating"],
        reviews: reviews,
        crowd_status: adjusted_crowd,
        image_url: photo_url,
        kilometers: distance.round(2)
      }
    rescue StandardError => e
      # Log the error and return an empty array or handle it as needed
      puts "Error fetching place details: #{e.message}"
      []
    end
  end
  
  
  def user_reviews(lat, long)
    establishment_types = ["cafe", "restaurant"]
  
    establishment_types.flat_map do |establishment_type|
      # Construct the API URL dynamically based on lat, long, and establishment type
      api_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{lat},#{long}&radius=2000&type=#{establishment_type}&key=#{@api_key}"
      
      # Perform the HTTP GET request
      response = Net::HTTP.get(URI(api_url))
      places = JSON.parse(response)["results"]
      
      places.flat_map do |place|
        # Fetch place details if place ID exists
        next unless place["place_id"]
        
        details_url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place['place_id']}&key=#{@api_key}"
        details_response = Net::HTTP.get(URI(details_url))
        details = JSON.parse(details_response)
        
        # Extract reviews and filter only 5-star ratings
        reviews = details.dig("result", "reviews")&.select { |review| review["rating"] == 5 } || []
        
        # Format each review to include establishment details, excluding empty review_text
        reviews.map do |review|
          next if review["text"].nil? || review["text"].strip.empty?
  
          review_date = Time.at(review["time"]).to_date
          formatted_date = review_date.strftime("%d %b") # Format: "20 Nov"
  
          {
            name: place["name"],
            place_id: place["place_id"],
            location: place.dig("geometry", "location"),
            reviewer_name: review["author_name"],
            photo_url: review["profile_photo_url"],
            review_text: review["text"],
            date: formatted_date
          }
        end.compact # Remove nil values
      end.compact # Remove nil values from places
    end
  end
  
  
  private 

  def custom_icons
  {
      "amusement_park" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FPark%20(2).png?alt=media&token=152a250b-d45e-46be-b81c-dedaa13bdd5d",
      "aquarium" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FAquarium.png?alt=media&token=431927fa-a03d-454f-a143-53cd5614ad45",
      "art_gallery" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FArt_Gallery.png?alt=media&token=8b0b8a66-dc9c-4274-9bee-3dced6953b63",
      "bakery" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FBakery.png?alt=media&token=44bf2270-cf3e-48b9-b218-3016fadb6f54",
      "bar" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FBar.png?alt=media&token=4cf78967-c718-4a35-83ec-0159395d33a3",
      "book_store" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FBook%20Store.png?alt=media&token=e5c30764-6856-4dca-b3ff-a59bceb65a51",
      "bowling_alley" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FBowling%20Alley.png?alt=media&token=57116d3b-c28b-44a6-9195-9cb938597395",
      "bus_station" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FBus%20Station.png?alt=media&token=ab63ce6a-cc34-4f5c-a66b-1ab3d8e630dd",
      "cafe" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FCafe.png?alt=media&token=2da233ec-600a-49e7-b1fb-4fdb1dceebd5",
      "campground" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FCampground.png?alt=media&token=e7ab68ff-bba9-40c5-a6a4-e95d0219d0d6",
      "casino" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FCasino.png?alt=media&token=f5f98607-4967-4882-ba4f-f06128ce934d",
      "cemetery" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FCemetry.png?alt=media&token=76ed3c10-2e61-4c08-9586-c2762072df0e",
      "church" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FChurch.png?alt=media&token=3413cccc-3e46-4310-90a2-5387da889dc5",
      "city_hall" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FCity%20Hall.png?alt=media&token=4e79527f-cb0f-4542-b5fc-4d6077b3d712",
      "clothing_store" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FClothing%20Store.png?alt=media&token=c35deb18-70e5-4c1e-a291-d18d810e02c1",
      "convenience_store" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FClothing%20Store.png?alt=media&token=c35deb18-70e5-4c1e-a291-d18d810e02c1",
      "department_store" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FDepartment%20Store.png?alt=media&token=20c205e8-8d23-4c39-ad43-47764349f9b6",
      "drugstore" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FDrug%20Store.png?alt=media&token=078386b0-c779-4c20-97a2-69e0f2bcba49",
      "electronics_store" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FElectronics%20Store.png?alt=media&token=67241fba-e2cb-4d6a-8b65-51def10cb89f",
      "florist" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FFlorist%20Store.png?alt=media&token=46b2de15-0376-4ca4-8cf4-0e5b73b8c14f",
      "gas" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FGas%20Station.png?alt=media&token=5e64109f-3e6b-46c0-89e1-e19578c7b651",
      "hair_care" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FHair%20Care.png?alt=media&token=d9e88011-9b06-42b9-a244-fc75db166b95",
      "home_goods_store" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FHome%20Goods%20Store.png?alt=media&token=aaa77645-d679-4da1-8515-3fb7c3ed2107",
      "lodging" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FHotel.png?alt=media&token=65b42bbc-f8f4-4b7c-b583-841599f8e9b2",
      "library" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FLibrary.png?alt=media&token=2643bf2a-197d-49a6-8f74-6df0e80f38d4",
      "movie_theater" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FMovie%20Theater.png?alt=media&token=ab68b01e-c91e-4c33-b01b-6b2a250bbb85",
      "museum" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FMuseum.png?alt=media&token=327f946f-039f-4d2a-9320-05b17c8d20b2",
      "night_club" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FNight%20Club.png?alt=media&token=49fd56bb-5034-4cff-8b1b-7e1bb632afba",
      "park" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FPark.png?alt=media&token=2c9e2ae3-5d65-45d2-bf60-76b90d459324",
      "pharmacy" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FPharmacy.png?alt=media&token=1eed3cfa-c26a-45c7-bb5a-3ef63e783d42",
      "restaurant" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FRestaurant.png?alt=media&token=9a6ef979-33c8-4f9b-80bd-d2c8337bb9f3",
      "rv_park" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FRV_Park.png?alt=media&token=e96cd092-7130-4867-8203-8a7aa4604f2c",
      "shopping_mall" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FShopping%20Mall.png?alt=media&token=7ec1669e-d6aa-414a-862f-d5d8f2f9595a",
      "spa" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FSpa.png?alt=media&token=38566a1b-559b-4086-9395-06a7c98780e7",
      "stadium" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FStadium.png?alt=media&token=e2147a85-7827-430e-a93e-55875b0332e8",
      "store" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FStore.png?alt=media&token=0f4c7a29-6962-4cb5-ac49-cc4bb2053979",
      "supermarket" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FSupermarket.png?alt=media&token=b229df64-de36-4e21-94cb-cafc6122b414",
      "tourist_attraction" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FTourist%20Attraction.png?alt=media&token=72023d50-78e1-40fd-aa32-48164e18ece8",
      "zoo" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FZoo.png?alt=media&token=e5039442-3e27-488d-8d2b-102459ac7f31"
    }
  end

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
