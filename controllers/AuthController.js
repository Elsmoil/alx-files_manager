// controllers/AuthController.js

import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';

class AuthController {
	  static async getConnect(req, res) {
		      const authHeader = req.headers['authorization'];
		      const [email, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

		      const db = dbClient.client.db('files_manager');
		      const user = await db.collection('users').findOne({ email, password: sha1(password) });

		      if (!user) {
			            return res.status(401).json({ error: 'Unauthorized' });
			          }

		      const token = uuidv4();
		      await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);

		      res.status(200).json({ token });
		    }

	  static async getDisconnect(req, res) {
		      const token = req.headers['x-token'];
		      const userId = await redisClient.get(`auth_${token}`);

		      if (!userId) {
			            return res.status(401).json({ error: 'Unauthorized' });
			          }

		      await redisClient.del(`auth_${token}`);
		      res.status(204).send();
		    }
}

export default AuthController;
