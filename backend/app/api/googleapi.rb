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

     custom_icons = {
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
      "hotel" => "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/icons%2FHotel.png?alt=media&token=65b42bbc-f8f4-4b7c-b583-841599f8e9b2",
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
