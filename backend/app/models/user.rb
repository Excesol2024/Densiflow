class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable,
  :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :notifications, dependent: :destroy
  has_many :savedplaces, dependent: :destroy
  has_many :appupdates, dependent: :destroy
  has_many :reviews, dependent: :destroy
   
end
