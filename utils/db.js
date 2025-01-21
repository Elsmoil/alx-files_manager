import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || '27017';
        const database = process.env.DB_DATABASE || 'files_manager';

        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url, { useUnifiedTopology: true });

        this.client.connect()
            .then(() => {
                console.log('MongoDB connected successfully');
                this.database = this.client.db(database); // Set database here
            })
            .catch((err) => {
                console.error('MongoDB connection failed:', err);
            });
    }

    async isAlive() {
        try {
            await this.database.admin().ping();
            return true;
        } catch {
            return false;
        }
    }

    async nbUsers() {
        if (!this.database) return 0;
        return this.database.collection('users').countDocuments();
    }

    async nbFiles() {
        if (!this.database) return 0;
        return this.database.collection('files').countDocuments();
    }
}

const dbClient = new DBClient();
export default dbClient;
