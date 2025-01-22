// controllers/UsersController.js
import dbClient from '../utils/db';
import sha1 from 'sha1';

class UsersController {
	  static async postNew(req, res) {
		      const { email, password } = req.body;

		      if (!email) {
			            return res.status(400).json({ error: 'Missing email' });
			          }

		      if (!password) {
			            return res.status(400).json({ error: 'Missing password' });
			          }

		      const db = dbClient.client.db('files_manager');
		      const userExists = await db.collection('users').findOne({ email });

		      if (userExists) {
			            return res.status(400).json({ error: 'Already exist' });
			          }

		      const hashedPassword = sha1(password);
		      const result = await db.collection('users').insertOne({ email, password: hashedPassword });

		      res.status(201).json({ id: result.insertedId, email });
		    }
}

export default UsersController;
