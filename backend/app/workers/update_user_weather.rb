require 'sidekiq-scheduler'

class UpdateUserWeather


  include Sidekiq::Worker 

  def perform
     puts "Hello World Hello World Hello World Hello World Hello World Hello World"
  end

end