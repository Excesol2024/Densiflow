require 'net/http'
require 'uri'
require 'json'

class NotificationJob
  include Sidekiq::Job

  def perform(notification_id, token)
    notification = Notification.find(notification_id)

    # Example logic for sending a notification
    # Replace this with your actual notification sending logic
    notification.update(crowd_status: "not crowded")
    send_notification(token, notification.name)
    puts "Notification sent: #{notification.name} at #{notification.scheduled_time} with token: #{token}"
  end

  private


  def send_notification(token, title)

    body = "is currently not crowded with only 10 people. Perfect for you!"
    token = FcmService.generate_access_token

    uri = URI.parse("https://fcm.googleapis.com/v1/projects/#{Rails.application.credentials[:project_id]}/messages:send")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.request_uri)
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{token}" 

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
