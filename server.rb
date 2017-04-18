require "redis"
require "cuba"
require "cuba/safe"
require "securerandom"
require_relative "lib/redis_ops"

Cuba.use Rack::Session::Cookie, :secret => "556c5c76-222e-11e7-93ae-92361f002671" # TODO: move secret to env variable

Cuba.plugin Cuba::Safe

DB = RedisOps.new(Redis.new)

Cuba.define do
  on "upvotes/:comic_id" do |comic_id|
    on post do
      user_id = req.session[:user_id]
      unless user_id.nil?
        DB.add_favourite(user_id, comic_id)
        res.write "OK"
      else
        res.status = 401
      end
    end
  end

  on "favourites" do |user_id|
    on get do
      user_id = req.session[:user_id]
      unless user_id.nil?
        res.headers["Content-Type"] = "application/javascript; charset=utf-8"
        res.write DB.get_favourites(user_id)
      else
        res.status = 401
      end
    end
  end

  on "upvotes", param("comic_ids") do |comic_ids_str|
    on get do
      comic_ids = comic_ids_str.split(",")
      user_id = req.session[:user_id]
      unless user_id.nil?
        res.headers["Content-Type"] = "application/javascript; charset=utf-8"
        res.write DB.get_votes(comic_ids)
      else
        res.status = 401
      end
    end
  end

  # serving static files
  on get do
    on root do
      # set session's user_id
      user_id = env['rack.session'][:user_id]
      env['rack.session'][:user_id] = SecureRandom.uuid if user_id.nil?
      res.headers["Content-Type"] = "text/html; charset=utf-8"
      res.write(IO.read('./dist/index.html'))
    end
    on "assets", extension("png") do |file|
      res.write(IO.read("./dist/assets/#{file}.png"))
    end
    on "bundle.js" do
      res.headers["Content-Type"] = "application/javascript; charset=utf-8"
      res.write(IO.read("./dist/bundle.js"))
    end
  end
end