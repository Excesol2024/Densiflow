# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]

  respond_to :json

  def create
    self.resource = warden.authenticate!(auth_options)
    if resource.persisted?
      sign_in(resource_name, resource)
      render json: { status: :ok, message: 'Login successful', user: resource }
    else
      render json: { status: 'error', message: 'Login Failed', errors: ['Invalid email or password'] }, status: :unprocessable_entity
    end
  end

  # DELETE /users/sign_out
  def destroy
    if current_user
      render json: {
        status: 200,
        message: "logged out successfully"
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  # def create
  #   super
  # end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
