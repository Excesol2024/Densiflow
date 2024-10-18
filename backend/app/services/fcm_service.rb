require 'googleauth'
require 'json'

class FcmService
  def self.generate_access_token
    # Define your Firebase service account key as a JSON string
    firebase = {
      "type": "service_account",
      "project_id": "#{Rails.application.credentials[:project_id]}",
      "private_key_id": "#{Rails.application.credentials[:private_key_id]}",
      "private_key": Rails.application.credentials[:private_key].gsub("\\n", "\n"),
      "client_email": "#{Rails.application.credentials[:client_email]}",
      "client_id": "#{Rails.application.credentials[:client_id]}",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "#{Rails.application.credentials[:client_x509_cert_url]}",
      "universe_domain": "googleapis.com"
    }
    
    # Generate the JSON string from the hash
    key_file = JSON.generate(firebase)

    scopes = ['https://www.googleapis.com/auth/firebase.messaging']
    authorizer = Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: StringIO.new(key_file),
      scope: scopes
    )

    # Fetch and return the access token
    authorizer.fetch_access_token!['access_token']
  end
end
