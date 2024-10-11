class FeedbacksController < ApplicationController
  def create
    @feedback = Feedback.new(feedback_params)

    if @feedback.save
      render json: { message: 'Feedback submitted successfully!' }, status: :created
    else
      render json: { errors: @feedback.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def feedback_params
    params.require(:feedback).permit(:name, :email, :message)
  end
end
