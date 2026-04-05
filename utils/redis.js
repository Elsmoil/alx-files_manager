// utils/redis.js

import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      },
    });

    // Handle errors
    this.client.on('error', (err) => {
      console.error('Redis Error:', err);
    });

    this.client.connect().catch((err) => {
      console.error('Redis connection error:', err);
    });
  }

  isAlive() {
    return this.client.isReady;
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, value, duration) {
    return this.client.setEx(key, duration, value);
  }

  async del(key) {
    return this.client.del(key);
  }
}

// Export RedisClient instance
const redisClient = new RedisClient();
export default redisClient;
