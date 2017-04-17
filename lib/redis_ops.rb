
class RedisOps
  def initialize(redis)
    @redis = redis
  end

  def add_favourite(user_id, comic_id)
    _, comic_has_been_updated, num_of_votes = @redis.multi do
      @redis.sadd users(user_id), comic_id
      @redis.sadd comics(comic_id), user_id
      @redis.scard comics(comic_id)
    end
    if comic_has_been_updated
      @redis.zadd comics_by("votes"), num_of_votes, comic_id
    end
    # [comic_id, comic_has_been_updated, num_of_votes]
  end

  def get_favourites(user_id)
    @redis.smembers users(user_id)
  end

  def get_votes(comic_ids)
    @redis.pipelined do
      comic_ids.each{|id|
        @redis.scard comics(id)}
    end
  end

  private
  def comics(id); "comics:#{id}" end
  def users(id); "users:#{id}" end
  def comics_by(feature); "comics_by:#{feature}" end
end
