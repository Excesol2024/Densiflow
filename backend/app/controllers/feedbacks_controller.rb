class FeedbacksController < ApplicationController
  
  def create
   name = params[:name]
   email = params[:email]
   message = params[:message]
   FeedbacksMailer.send_feedbacks(name, email, message).deliver_now
   render json: {status: "success"}
  end

  


end
