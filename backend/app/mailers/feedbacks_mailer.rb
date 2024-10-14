class FeedbacksMailer < ApplicationMailer

  def send_feedbacks(name, email, message)
    @email = email
    @name = name
    @message = message
    mail(to: "info.excesol@gmail.com", subject: 'Densiflow User App Feedback')
  end

end
