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
end

class Event < ActiveRecord::Base
  has_many :comments
end

###########################################################
# Routes
###########################################################

get '/comments' do
  Comment.take(10).to_json
end

post '/comments' do
  data = JSON.parse request.body.read
  p "data: #{data}"
  user = data['username']
  text = data['text']
  comment = Comment.create( comment: text, username: user )
  comment.save
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

get %r{/([0-9]+)} do |c|
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
