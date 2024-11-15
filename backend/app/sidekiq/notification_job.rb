require 'net/http'
require 'uri'
require 'json'

class NotificationJob
  include Sidekiq::Job

  def perform(notification_id, token)
    notification = Notification.find(notification_id)

    url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{notification.placesID}&fields=id,name,reviews,photo,rating,user_ratings_total,types&key=#{Rails.application.credentials[:google_api]}"
    
    # Fetch place details from Google Places API
    response = Net::HTTP.get(URI(url))
    place_details = JSON.parse(response)["result"]

    user_ratings_total = place_details["user_ratings_total"]
    types = place_details["types"]
    scheduled_time = notification.scheduled_time

    if user_ratings_total && types.include?("restaurant")
      crowd_status = determine_crowd_status(user_ratings_total, scheduled_time)
      notification.update(crowd_status: crowd_status)
    else
      notification.update(crowd_status: "low")
    end

    send_notification(token, notification.name, notification.crowd_status)
    puts "Notification sent: #{notification.name} at #{notification.scheduled_time} with token: #{token}, crowd_status: #{notification.crowd_status}"
  end

  private

  def determine_crowd_status(user_ratings_total, scheduled_time)
    # Ensure scheduled time is within a valid range
    if scheduled_time.hour >= 10 && scheduled_time.hour <= 20
      if user_ratings_total > 100
        "high"
      elsif user_ratings_total.between?(50, 100)
        "medium"
      else
        "low"
      end
    elsif user_ratings_total < 20
      "low"
    else
      "low"
    end
  end

  def send_notification(token, title, crowd_status)
    # Determine the body message based on the crowd status
    body = case crowd_status
           when "high"
             "is currently crowded with 30+ people. Consider visiting later!"
           when "medium"
             "is moderately crowded with 15+ people. Plan accordingly."
           when "low"
             "is currently not crowded with only 10+ people. Perfect for you!"
           else
             "has an unknown crowd status. Check the latest updates before visiting."
           end
  
    access_token  = FcmService.generate_access_token
  
    uri = URI.parse("https://fcm.googleapis.com/v1/projects/#{Rails.application.credentials[:project_id]}/messages:send")
  
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
  
    request = Net::HTTP::Post.new(uri.request_uri)
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{access_token}"
  
    # Prepare the payload
    payload = {
      message: {
        token: token,
        notification: {
          title: title,
          body: body
        }
      }
    }
  
    request.body = payload.to_json
  
    response = http.request(request)
  
    if response.code.to_i == 200
      puts "Notification sent successfully!"
    else
      puts "Error sending notification: #{response.body}"
    end
  end
end
