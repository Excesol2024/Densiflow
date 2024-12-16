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
      crowd_status = determine_crowd_status(user_ratings_total, scheduled_time, place_details["reviews"])
      notification.update(crowd_status: crowd_status)
    else
      notification.update(crowd_status: "low")
    end

    send_notification(token, notification.name, notification.crowd_status)
    puts "Notification sent: #{notification.name} at #{notification.scheduled_time} with token: #{token}, crowd_status: #{notification.crowd_status}"
  end

  private

  def determine_crowd_status(user_ratings_total, scheduled_time, reviews)
    # Get the current UTC time and day of the week
    utc_time = Time.now.utc
    current_hour = utc_time.hour
    day_of_week = utc_time.wday

    # Determine establishment type
    establishment_type = "restaurant"  # assuming restaurant for this example; adjust if needed
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
                  when 0..24 then "low"
                  when 25..50 then "medium"
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
    recent_reviews = reviews.select do |review|
      review_time_philippines = review["time"] + 8 * 60 * 60 # Convert to Philippines time (GMT +8)
      (utc_time.to_i - review_time_philippines) <= 60 * 60 # Recent within the last hour
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
