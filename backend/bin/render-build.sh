set -o errexit

bundle install
bundle exec rails db:create # Create the database (if it doesn't already exist)
bundle exec rails db:migrate # Run database migrations
bundle exec rails assets:precompile
bundle exec rails assets:clean