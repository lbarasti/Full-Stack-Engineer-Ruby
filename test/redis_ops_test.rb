require 'minitest/autorun'
require 'redis'
require_relative '../lib/redis_ops'

redis = Redis.new :db => 15
begin
  redis.ping
rescue Redis::CannotConnectError => e
  puts "Please ensure your local instance of Redis is running"
  raise e
end

describe "RedisOps" do
  comics = (1..9).map{|i| "c_#{i}"}
  ops = RedisOps.new(redis)
  before do
    redis.flushdb
  end
  it "supports adding comics to user's favourites list" do
    comics.each {|c_id|
      ops.add_favourite 1, c_id
      assert redis.sismember("users:1", c_id)
      assert redis.sismember("comics:#{c_id}", 1)
      redis.zscore("comics_by:votes", c_id).must_equal 1
    }

    comics.each_with_index {|c_id, idx|
      next if idx % 2 == 0
      ops.add_favourite 2, c_id
      assert redis.sismember("users:2", c_id)
      assert redis.sismember("comics:#{c_id}", 2)
      redis.zscore("comics_by:votes", c_id).must_equal 2
    }
    comics.each_with_index {|c_id, idx|
      next if idx > 5
      ops.add_favourite 3, c_id
      assert redis.sismember("users:3", c_id)
      assert redis.sismember("comics:#{c_id}", 3)
      expected_score = redis.sismember("users:2", c_id) ? 3 : 2
      redis.zscore("comics_by:votes", c_id).must_equal expected_score
    }
    redis.smembers("users:1").sort.must_equal comics.sort
    redis.smembers("users:2").sort.must_equal comics.reject.with_index{|_,idx| idx % 2 == 0}.sort
    redis.smembers("users:3").sort.must_equal comics.reject.with_index{|_,idx| idx > 5}.sort
    redis.smembers("comics:c_1").sort.must_equal ["1", "3"]
    redis.smembers("comics:c_2").sort.must_equal ["1", "2", "3"]
    redis.zrangebyscore("comics_by:votes", 0, 5, withscores: true).sort.must_equal [
      ["c_1", 2.0],
      ["c_2", 3.0],
      ["c_3", 2.0],
      ["c_4", 3.0],
      ["c_5", 2.0],
      ["c_6", 3.0],
      ["c_7", 1.0],
      ["c_8", 2.0],
      ["c_9", 1.0]
    ]
  end
  it "supports retrieving favourites by user" do
    comics.each_with_index{|c_id, idx|
      ops.add_favourite(1, c_id)
      ops.add_favourite(2, c_id) if idx % 2 == 1
      ops.add_favourite(3, c_id) if idx < 4
    }
    ops.get_favourites(1).sort
      .must_equal(comics)
    ops.get_favourites(2).sort
      .must_equal(["c_2", "c_4", "c_6", "c_8"])
    ops.get_favourites(3).sort
      .must_equal(["c_1", "c_2", "c_3", "c_4"])
  end
  it "supports retrieving users who liked a comic book" do
    comics.each_with_index{|c_id, idx|
      ops.add_favourite(1, c_id)
      ops.add_favourite(2, c_id) if idx % 2 == 1
      ops.add_favourite(3, c_id) if idx < 4
    }

    ops.get_votes(comics).must_equal [
      2, 3, 2, 3, 1, 2, 1, 2, 1
    ]
  end
end