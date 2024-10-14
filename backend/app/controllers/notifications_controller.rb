class NotificationsController < ApplicationController
  before_action :authenticate_user! 

  def create
    @notification = current_user.notifications.build(notification_params)

    if @notification.save
      render json: { status: "success", notification: @notification }
    else
      render json: { status: "error", errors: @notification.errors.full_messages }
    end
  end

  private

  def notification_params
    params.require(:notification).permit(:lat, :long, :name, :scheduled_time)
  end

end
