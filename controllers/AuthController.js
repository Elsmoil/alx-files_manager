// controllers/AuthController.js
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Unauthorized' });

    const [type, credentials] = auth.split(' ');
    if (type !== 'Basic') return res.status(401).json({ error: 'Unauthorized' });

    const [email, password] = Buffer.from(credentials, 'base64').toString().split(':');
    const db = dbClient.client.db();
    const user = await db.collection('users').findOne({ email });
    if (!user || user.password !== SHA1(password).toString()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id, 86400); // 24 hours
    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    await redisClient.del(`auth_${token}`);
    res.status(204).send();
  }
}

export default AuthController;
