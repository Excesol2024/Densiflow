class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:set_otp, :check_otp, :update_password, :delete_account, :create]

  def current_user_info
    if current_user 
      render json: { user: current_user.as_json(except: [:jti, :created_at, :updated_at]) }
    else
      render json: { error: 'No user logged in' }, status: :unauthorized
    end
  end
  
    def set_otp
      user = User.find_by(email: params[:email])
      if user
        otp = generate_otp
        user.update(password_key: otp, key_expires: 10.minutes.from_now)
        UserMailer.update_password(user, otp).deliver_now
        render json: { message: 'OTP generated and stored successfully.', status: "success"}, status: :ok
      else
        render json: { errors: ['User not found.'], status: "error" }, status: :not_found
      end
    end

    def check_otp
      user = User.find_by(email: params[:email]);
      if user && user.password_key == params[:otp] && user.key_expires > Time.current
        render json: {message: "You can Now change your Password", status: "success"}, status: :ok
      else
        render json: { errors: ['Invalid or expired OTP.'], status: "error" }, status: :unprocessable_entity
      end
    end

    def update_password
      user = User.find_by(email: params[:email])
      if user && user.password_key == params[:otp] && user.key_expires > Time.current
        if user.update(password: params[:password], password_confirmation: params[:password_confirmation])
          user.update(password_key: nil, key_expires: nil)
    
          render json: { message: 'Password updated successfully.', status: "success" }, status: :ok
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { errors: ['Invalid or expired OTP.'], status: "error" }, status: :unprocessable_entity
      end
    end

    def delete_account
      user = User.find_by(email: params[:email])
    
      if user && user.valid_password?(params[:password])  
        # Delete associated notifications
        user.notifications.destroy_all  # This deletes all notifications associated with the user
    
        # Now, delete the user
        user.destroy
    
        render json: { message: 'Account deleted successfully.', status: "success" }, status: :ok
      else
        render json: { errors: ['Invalid email or password.'], status: "error" }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotFound
      render json: { errors: ['User not found.'], status: "error" }, status: :not_found
    rescue => e
      render json: { errors: [e.message], status: "error" }, status: :internal_server_error
    end

    def create
      user = User.new(user_params)
      if user.save
        render json: { message: 'User created successfully', user: user }, status: :created
      else
        render json: { error: user.errors.full_messages }, status: :unprocessable_entity
      end
    end
    
    def update_user_current_location
      if current_user
        # Extract longitude and latitude from params
        longitude = params[:longitude]
        latitude = params[:latitude]
    
        # Update the user's location attributes
        if current_user.update(lat: latitude, long: longitude)
          render json: { status: :ok, message: 'Location updated successfully', user: current_user }, status: :ok
        else
          render json: { status: 'error', message: 'Failed to update location', errors: current_user.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { status: 'error', message: 'User not authenticated' }, status: :unauthorized
      end
    end

    def update_photo
      if current_user.update(photo_url_params)
        render json: { message: 'Photo updated successfully', photo_url: current_user.photo_url }, status: :ok
      else
        render json: { error: 'Failed to update photo' }, status: :unprocessable_entity
      end
    end

    def all_users
      @users = User.all # Fetch all users from the database
      render json: @users # Render the users as JSON
    end



    private

    def generate_otp
      rand(1000..9999).to_s 
    end

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :photo_url)
    end

    def photo_url_params
      params.require(:user).permit(:photo_url)
    end
 
end
