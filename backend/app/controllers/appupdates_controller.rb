class AppupdatesController < ApplicationController
    before_action :authenticate_user!, except: [:create]

    ADMIN_PASSWORD = "#{Rails.application.credentials[:admin_password]}" # Replace with your actual password
    def create
      unless params[:admin_password] == ADMIN_PASSWORD
        render json: { error: "Unauthorized access" }, status: :unauthorized and return
      end
    
      appupdate_params = params.require(:appupdate).permit(:title, :descriptions, :notification_type)
      users = User.all
      appupdates = []
      failed_users = []
    
      users.each do |user|
        appupdate = user.appupdates.new(appupdate_params)
        if appupdate.save
          AppupdatesJob.perform_async(user.firebase_token, appupdate.id)
          appupdates << appupdate
        else
          failed_users << { user_id: user.id, errors: appupdate.errors.full_messages }
        end
      end
    
      render json: {
        message: 'App updates processed',
        success: appupdates,
        failures: failed_users
      }, status: :multi_status
    end


    def delete_appupdates
        # Find the app update belonging to the current_user
        appupdate = current_user.appupdates.find_by(id: params[:id])
    
        if appupdate
          appupdate.destroy
          render json: { message: 'App update deleted successfully' }, status: :ok
        else
          render json: { error: 'App update not found or not authorized' }, status: :not_found
        end
      end

      def user_appupdates
        @user_appupdates = current_user.appupdates
        
        if @user_appupdates.any?
          render json: { status: 'success', data: @user_appupdates }, status: :ok
        else
          render json: { status: 'error', message: 'No appupdates found' }, status: :ok
        end
      end

end
