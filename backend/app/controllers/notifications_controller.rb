class NotificationsController < ApplicationController
  before_action :authenticate_user! 

  def create
    @notification = current_user.notifications.build(notification_params)
  
    if @notification.save
      scheduled_time = @notification.scheduled_time
  
      Rails.logger.info "Scheduled time: #{scheduled_time}, Current time: #{Time.current}"
  
      if scheduled_time > Time.current
        NotificationJob.perform_at(scheduled_time, @notification.id, current_user.firebase_token)
        render json: { status: "success", notification: @notification, token: current_user.firebase_token }
      else
        render json: { status: "error", message: "Scheduled time must be in the future." }, status: :unprocessable_entity
      end
    else
      render json: { status: "error", errors: @notification.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def delete_notifications
    notif_id = params[:id] 
    if current_user
      # Find the notification by ID and ensure it belongs to the current user
      notification = current_user.notifications.find_by(id: notif_id)
      
      if notification
        notification.destroy
        render json: { status: "success", message: "Notification successfully deleted" }, status: :ok
      else
        render json: { status: "error", message: "Notification not found" }, status: :not_found
      end
    else
      render json: { status: 'error', message: 'User not authenticated' }, status: :unauthorized
    end
  end

  def user_notifications
    @user_notifications = current_user.notifications
    
    if @user_notifications.any?
      render json: { status: 'success', data: @product_carts }, status: :ok
    else
      render json: { status: 'error', message: 'No carts found' }, status: :ok
    end
  end


  private

  def notification_params
    params.require(:notification).permit(:lat, :long, :name, :scheduled_time, :placesID)
  end

end
