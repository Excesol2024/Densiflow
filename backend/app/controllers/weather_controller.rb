require 'net/http'
require 'uri'
require 'json'

class WeatherController < ApplicationController

  def weather_for_user
    longitude = params[:longitude]
    latitude = params[:latitude]
    url = URI("https://api.openweathermap.org/data/2.5/weather?lat=#{latitude}&lon=#{longitude}&appid=146bdf70661a52b2e3659dd547766e3c")
    response = Net::HTTP.get(url)
    weather_data = JSON.parse(response)
    render json: weather_data
  end

  

end
