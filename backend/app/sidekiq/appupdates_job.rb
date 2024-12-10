class AppupdatesJob
  include Sidekiq::Job

  def perform(token, appupdate_id)
    appupdate = Appupdate.find(appupdate_id)
    send_notification(token, appupdate.title, appupdate.descriptions)
    Rails.logger.info "Notification sent: #{appupdate.title} with token: #{token}"
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "Appupdate not found: #{e.message}"
  rescue => e
    Rails.logger.error "Error in notification job: #{e.message}"
  end

  private

  def send_notification(token, title, descriptions)
    access_token = FcmService.generate_access_token
    uri = URI.parse("https://fcm.googleapis.com/v1/projects/#{Rails.application.credentials[:project_id]}/messages:send")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.request_uri)
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{access_token}"

    payload = {
      message: {
        token: token,
        notification: {
          title: title,
          body: descriptions
        }
      }
    }

    request.body = payload.to_json
    response = http.request(request)

    if response.code.to_i == 200
      Rails.logger.info "Notification sent successfully!"
    else
      Rails.logger.error "Error sending notification: #{response.body}"
    end
  end

end
