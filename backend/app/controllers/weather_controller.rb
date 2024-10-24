require 'net/http'
require 'uri'
require 'json'

class WeatherController < ApplicationController
  before_action :authenticate_user!

  def weather_for_user
    if current_user
      # Check if latitude and longitude are present
      if params[:latitude].present? && params[:longitude].present?
        longitude = params[:longitude]
        latitude = params[:latitude]
  
        # Update user's location
        current_user.update(lat: latitude, long: longitude)
  
        # Fetch weather data
        begin
          url = URI("https://api.openweathermap.org/data/2.5/weather?lat=#{latitude}&lon=#{longitude}&appid=#{Rails.application.credentials[:weatherAPI]}")
          response = Net::HTTP.get(url)
          weather_data = JSON.parse(response)
          
          # Render weather data
          render json: weather_data
        rescue StandardError => e
          # Handle API errors or any unexpected errors
          render json: { error: 'Failed to fetch weather data', details: e.message }, status: :bad_request
        end
      else
        render json: { error: 'Latitude and longitude are required' }, status: :unprocessable_entity
      end
    else
      render json: { error: 'User must be logged in' }, status: :unauthorized
    end
  end  

  def send_push_notification
    user_token = params[:token]
    title = params[:title]
    body = params[:body]

    if user_token.blank? || title.blank? || body.blank?
      render json: { error: 'Token, title, and body are required' }, status: :unprocessable_entity
      return
    end

    # Send notification
    send_notification(user_token, title, body)

    render json: { message: 'Notification sent', status: "ok" }, status: :ok
  end

  private

  def send_notification(token, title, body)
    uri = URI.parse("https://fcm.googleapis.com/v1/projects/#{Rails.application.credentials[:project_id]}/messages:send")
    token = FcmService.generate_access_token

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
