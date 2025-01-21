// controllers/AppController.js

import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
  // Method to check the status of Redis and DB
  static async getStatus(req, res) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();

    return res.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  // Method to get the stats from the DB (number of users and files)
  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();
      return res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      return res.status(500).json({ error: 'Unable to fetch stats' });
    }
  }
}

export default AppController;
