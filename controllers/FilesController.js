// controllers/FilesController.js
import { Router } from 'express';
import { redisClient } from '../utils/redis';
import { dbClient } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import util from 'util';

const router = Router();

// Utility function to check token and get user from Redis
async function getUserFromToken(token) {
  const userId = await redisClient.get(`auth_${token}`);
  if (!userId) {
    throw new Error('Unauthorized');
  }
  const user = await dbClient.db.collection('users').findOne({ _id: userId });
  return user;
}

// POST /files - Upload a new file
router.post('/', async (req, res) => {
  try {
    const { name, type, data, parentId = 0, isPublic = false } = req.body;
    const { token } = req.headers;

    // Get the user based on the token
    const user = await getUserFromToken(token);

    // Validate inputs
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['file', 'image', 'folder'].includes(type)) {
      return res.status(400).json({ error: 'Missing or invalid type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    // Validate parentId
    if (parentId !== 0) {
      const parentFile = await dbClient.db.collection('files').findOne({ _id: parentId });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    // Handle file upload if type is file or image
    if (type !== 'folder') {
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Generate a unique file name
      const filePath = path.join(folderPath, uuidv4());
      const buffer = Buffer.from(data, 'base64');
      fs.writeFileSync(filePath, buffer);

      // Save the file in the database
      const file = {
        userId: user._id,
        name,
        type,
        parentId,
        isPublic,
        localPath: filePath
      };
      const result = await dbClient.db.collection('files').insertOne(file);
      return res.status(201).json(result.ops[0]);
    }

    // Handle folder creation
    const folder = {
      userId: user._id,
      name,
      type,
      parentId,
      isPublic
    };
    const result = await dbClient.db.collection('files').insertOne(folder);
    return res.status(201).json(result.ops[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /files/:id - Retrieve file by ID
router.get('/:id', async (req, res) => {
  try {
    const { token } = req.headers;
    const { id } = req.params;

    // Get the user based on the token
    const user = await getUserFromToken(token);

    // Find the file
    const file = await dbClient.db.collection('files').findOne({ _id: id, userId: user._id });
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json(file);
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

// GET /files - List user files with pagination
router.get('/', async (req, res) => {
  try {
    const { token } = req.headers;
    const { parentId = 0, page = 0 } = req.query;

    // Get the user based on the token
    const user = await getUserFromToken(token);

    // Fetch user files with pagination
    const files = await dbClient.db.collection('files')
      .find({ userId: user._id, parentId })
      .skip(page * 20)
      .limit(20)
      .toArray();

    return res.status(200).json(files);
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;
