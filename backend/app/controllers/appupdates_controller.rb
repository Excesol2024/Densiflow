class AppupdatesController < ApplicationController
    before_action :authenticate_user!, except: [:create]

    ADMIN_PASSWORD = "your_secure_admin_password" # Replace with your actual password
    def create
      # Check if the provided admin password is correct
      unless params[:admin_password] == ADMIN_PASSWORD
        render json: { error: "Unauthorized access" }, status: :unauthorized and return
      end
  
      # Extract the parameters for the app update
      appupdate_params = params.require(:appupdate).permit(:title, :descriptions, :notification_type)
  
      # Iterate through all users and create an app update for each one
      users = User.all
      appupdates = []
  
      users.each do |user|
        appupdate = user.appupdates.new(appupdate_params)
        if appupdate.save
          appupdates << appupdate
        else
          # Handle any errors (e.g., validation errors)
          render json: { errors: appupdate.errors.full_messages, user_id: user.id }, status: :unprocessable_entity and return
        end
      end
  
      render json: { message: 'App updates saved successfully for all users', appupdates: appupdates }, status: :created
    end


    def destroy
        # Find the app update belonging to the current_user
        appupdate = current_user.appupdates.find_by(id: params[:id])
    
        if appupdate
          appupdate.destroy
          render json: { message: 'App update deleted successfully' }, status: :ok
        else
          render json: { error: 'App update not found or not authorized' }, status: :not_found
        end
      end

end
