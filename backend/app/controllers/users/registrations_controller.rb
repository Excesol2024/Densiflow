# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]
  
  def create
    # Find pending user by email
    pending_user = Pending.find_by(email: params[:email])
  
    if pending_user && pending_user.otp == params[:otp] && pending_user.otp_expires > Time.now
      # Prepare sign-up parameters using the pending user's details
      sign_up_params = {
          name: pending_user.name,
          email: pending_user.email,
          password: pending_user.password,
          password_confirmation: pending_user.password
      }
  
      # Build the actual user from the pending user data
      build_resource(sign_up_params)
  
      if resource.save
        # Destroy the pending user record after successful registration
        pending_user.destroy
  
        render json: {status: "success", message: "User successfully registered." }, status: :ok
      else
        render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: "Invalid OTP or OTP expired.", status: "error" }, status: :unprocessable_entity
    end
  end
  

  
 
  

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  # def create
  #   super
  # end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end

 

end
