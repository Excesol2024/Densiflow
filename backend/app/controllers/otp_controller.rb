class OtpController < ApplicationController

  def home
    render json: {message: "You are not Authorized"}
  end

  def initial_registration
    # Extract user params
    user_params = params.require(:pending).permit(:name, :email, :password)
  
    # Check if the email already exists in `users` or `pendings` tables
    if User.exists?(email: user_params[:email])
      render json: { error: "Email already taken" }, status: :unprocessable_entity
      return
    end
  
    # Check if a pending user record already exists
    pending_user = Pending.find_by(email: user_params[:email])
  
    if pending_user
      # Generate a new OTP and expiration time
      otp_code = generate_otp
      otp_expiration = 10.minutes.from_now
  
      # Update the existing pending user record with the new OTP, expiration time, and password
      pending_user.update(
        name: user_params[:name],
        otp: otp_code,
        otp_expires: otp_expiration,
        password: user_params[:password]  # Update the password here
      )
  
      if pending_user.save
        # Resend OTP to the user's email
        UserMailer.send_otp(pending_user, otp_code).deliver_now
        render json: { message: "New OTP sent to your email. Please verify." }, status: :ok
      else
        render json: { errors: pending_user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      # Generate OTP and expiration time for a new record
      otp_code = generate_otp
      otp_expiration = 10.minutes.from_now
  
      # Create a new pending user record
      pending_user = Pending.create(
        name: user_params[:name],
        email: user_params[:email],
        password: user_params[:password],
        otp: otp_code,
        otp_expires: otp_expiration
      )
  
      if pending_user.persisted?
        # Send OTP to the user's email
        UserMailer.send_otp(pending_user, otp_code).deliver_now
        render json: { message: "OTP sent to your email. Please verify." }, status: :ok
      else
        render json: { errors: pending_user.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
  

  

  private

  def generate_otp
    rand(1000..9999).to_s 
  end

end
