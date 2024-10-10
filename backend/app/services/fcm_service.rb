# app/services/fcm_service.rb
require 'googleauth'

class FcmService
  def self.generate_access_token
    # Path to your service account key file
    key_file = Rails.root.join('config', 'densiflowapp-firebase-adminsdk-erm47-539d4c6069.json')

    scopes = ['https://www.googleapis.com/auth/firebase.messaging']
    authorizer = Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: File.open(key_file),
      scope: scopes
    )

    # Fetch and return the access token
    authorizer.fetch_access_token!['access_token']
  end
end
