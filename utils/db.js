import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const url = `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}`;
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.db = this.client.db(process.env.DB_DATABASE || 'files_manager');
  }

  async isAlive() {
    try {
      await this.client.connect();
      return true;
    } catch (err) {
      console.error('MongoDB Error:', err);
      return false;
    }
  }

  async nbUsers() {
    const usersCollection = this.db.collection('users');
    const count = await usersCollection.countDocuments();
    return count;
  }

  async nbFiles() {
    const filesCollection = this.db.collection('files');
    const count = await filesCollection.countDocuments();
    return count;
  }
}

// Export DBClient instance
const dbClient = new DBClient();
export default dbClient;
