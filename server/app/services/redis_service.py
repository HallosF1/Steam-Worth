async def get_from_redis(redis, key):
    return await redis.get(key)

async def set_to_redis(redis, key, value, ttl=None):
    if ttl:
        await redis.set(key, value, ex=ttl)
    else:
        await redis.set(key, value)
