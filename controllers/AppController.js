// controllers/AppController.js

import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
	  static async getStatus(req, res) {
		      const status = {
			            redis: redisClient.isAlive(),
			            db: await dbClient.isAlive(),
			          };
		      res.status(200).json(status);
		    }

	  static async getStats(req, res) {
		      const stats = {
			            users: await dbClient.nbUsers(),
			            files: await dbClient.nbFiles(),
			          };
		      res.status(200).json(stats);
		    }
}

export default AppController;
