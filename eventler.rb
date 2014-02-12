require 'sinatra'
require "sinatra/reloader" if development?
require 'active_record'
require 'digest/sha1'
require 'pry'
require 'uri'

###########################################################
# Configuration
###########################################################

set :public_folder, File.dirname(__FILE__) + '/public'

configure :development, :production do
    ActiveRecord::Base.establish_connection(
       :adapter => 'sqlite3',
       :database =>  'db/dev.sqlite3.db'
     )
end

# Handle potential connection pool timeout issues
after do
    ActiveRecord::Base.connection.close
end

# turn off root element rendering in JSON
ActiveRecord::Base.include_root_in_json = false

get '/' do
    File.read(File.join(File.dirname(__FILE__), "public/index.html"))
end

###########################################################
# Models
###########################################################
# Models to Access the database through ActiveRecord.
# Define associations here if need be
# http://guides.rubyonrails.org/association_basics.html

class Comment < ActiveRecord::Base
  belongs_to :event
end

class Event < ActiveRecord::Base
  has_many :comments, dependent: :destroy
  has_many :invitees, dependent: :destroy
end

class Invitee < ActiveRecord::Base
  belongs_to :event
  self.primary_key = 'name'
end

###########################################################
# Routes
###########################################################

get '/invitees' do
  Invitee.take(100).to_json
end

get %r{/event/([0-9]+)/invitees} do |c|
  Invitee.where(event_id: c).to_json
end

post %r{/event/([0-9]+)/invitees/([^/]+)} do |event, user|
  data = JSON.parse request.body.read
  p "invitee data: #{data}"
  p "C: #{user}, #{event}"
  user = data['name']
  status = data['status']
  event = Event.find_by_id(event)
  invitee = event.invitees.find_by_name(user)
  p invitee.to_json
  if(invitee)
    invitee.update( status: status )
  else
    event.invitees.create( name: user, status: status );
  end

  # Event.find_by_id(c).invitees.to_json
end

get '/comments' do
  Comment.take(100).to_json
end

get %r{/event/([0-9]+)/comments} do |c|
  Comment.where(event_id: c).to_json
end

post %r{/event/([0-9]+)/comments} do |c|
  data = JSON.parse request.body.read
  p "data: #{data}"
  p "C: #{c}"
  user = data['username']
  text = data['text']
  event = Event.find_by_id(c)
  comments = event.comments
  p comments.to_json
  comments.create( comment: text, username: user )
  Event.find_by_id(c).comments.to_json
  # comment.save
end

post '/events' do
  data = JSON.parse request.body.read
  p "event data: #{data}"
  event = Event.create( data )
  event.save
  event.to_json
end

get '/events' do
  Event.take(10).to_json
end

get %r{/event/([0-9]+)} do |c|
  event = Event.find_by_id(c)
  event.to_json
end

###########################################################
# Utility
###########################################################

def read_url_head url
    head = ""
    url.open do |u|
        begin
            line = u.gets
            next  if line.nil?
            head += line
            break if line =~ /<\/head>/
        end until u.eof?
    end
    head + "</html>"
end

def get_url_title url
    # Nokogiri::HTML.parse( read_url_head url ).title
    result = read_url_head(url).match(/<title>(.*)<\/title>/)
    result.nil? ? "" : result[1]
end
