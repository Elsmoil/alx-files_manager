// utils/db.js
import { MongoClient } from 'mongodb';

class DBClient {
	 constructor() {
		 const host = process.env.DB_HOST || 'localhost';
		 const port = process.env.DB_PORT || 27017;
		 const database = process.env.DB_DATABASE || 'files_manager';
		 this.url = `mongodb://${host}:${port}`;
		 this.dbName = database;
		 this.client = new MongoClient(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
                             }

     async isAlive() {
	try {
		await this.client.connect();
		return true;
		} catch (err) {
	          console.error(`MongoDB error: ${err}`);
	          return false;
        }
    }

	async nbUsers() {
		    const db = this.client.db(this.dbName);
		    const users = await db.collection('users').countDocuments();
		    return users;
    }

     async nbFiles() {
	         const db = this.client.db(this.dbName);
	         const files = await db.collection('files').countDocuments();
	         return files;
    }
}

const dbClient = new DBClient();
export default dbClient;
