class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:set_otp, :check_otp, :update_password, :delete_account]

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
        user.destroy
        render json: { message: 'Account deleted successfully.', status: "success" }, status: :ok
      else
        render json: { errors: ['Invalid email or password.'], status: "error" }, status: :unprocessable_entity
      end
    end
    
    


    private

    def generate_otp
      rand(1000..9999).to_s 
    end
 
end
