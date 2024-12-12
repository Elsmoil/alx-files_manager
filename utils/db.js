// utils/db.js

import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    this.uri = `mongodb://${host}:${port}`;
    this.dbName = database;
    this.client = new MongoClient(this.uri);
  }

  async isAlive() {
    try {
      await this.client.connect();
      return true;
    } catch (error) {
      console.error('DB error:', error);
      return false;
    }
  }

  async nbUsers() {
    const db = this.client.db(this.dbName);
    const collection = db.collection('users');
    return await collection.countDocuments();
  }

  async nbFiles() {
    const db = this.client.db(this.dbName);
    const collection = db.collection('files');
    return await collection.countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
