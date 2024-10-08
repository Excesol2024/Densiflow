class StripesController < ApplicationController
  before_action :authenticate_user!
  
  def payment_intent
    begin
      payment = Stripe::PaymentIntent.create({
        amount: 500, # Amount in cents, 300 = $3.00
        currency: 'usd',
      })

      render json: payment # Return the payment intent object as JSON
    rescue Stripe::CardError => e
      # Card-related error handling
      render json: { error: e.message }, status: :payment_required
    rescue Stripe::InvalidRequestError => e
      # Invalid parameters handling
      render json: { error: e.message }, status: :bad_request
    rescue Stripe::AuthenticationError => e
      # Authentication with Stripe's API failed
      render json: { error: e.message }, status: :unauthorized
    rescue Stripe::APIConnectionError => e
      # Network communication with Stripe failed
      render json: { error: e.message }, status: :service_unavailable
    rescue Stripe::StripeError => e
      # General Stripe errors
      render json: { error: e.message }, status: :internal_server_error
    rescue StandardError => e
      # Handle any other unexpected errors
      render json: { error: "Something went wrong: #{e.message}" }, status: :internal_server_error
    end
  end
  

  def show_payment_details
    begin
      intent_id = params[:id]
      details = Stripe::PaymentIntent.retrieve(intent_id)
      render json: details, status: :ok
    rescue Stripe::InvalidRequestError => e
      render json: { error: e.message }, status: :bad_request
    rescue Stripe::APIConnectionError => e
      render json: { error: 'Network error. Please try again later.' }, status: :service_unavailable
    rescue Stripe::StripeError => e
      render json: { error: 'An error occurred with the payment provider.' }, status: :internal_server_error
    end
  end

  def create
    # Create a new subscription with the permitted parameters
    @subscription = Subscribed.new(subscription_params)

    if @subscription.save
      # Respond with a success message or redirect as needed
      render json: { status: 'success', message: 'Subscription created successfully', data: @subscription }, status: :created
    else
      # Respond with error messages
      render json: { status: 'error', message: 'Failed to create subscription', errors: @subscription.errors.full_messages }, status: :unprocessable_entity
    end
  end


  private

  def subscription_params
    params.require(:subscribeds).permit(:email, :subscription_id)
  end


end
