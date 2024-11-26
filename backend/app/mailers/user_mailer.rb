class UserMailer < ApplicationMailer
  default from: 'no-reply@example.com'

  def send_otp(user, otp_code)
    @user = user
    @user_otp_code = otp_code
    mail(to: @user.email, subject: 'Your OTP Code')
  end

  def update_password(user, otp_code)
    @user = user
    @user_otp_code = otp_code
    mail(to: @user.email, subject: 'Your OTP Code')
  end

  def send_message(fullname, email)
    @fullname = fullname
    @email = email
    mail(to: @email, subject: "Hello #{@fullname}!")
  end
  
end
