const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

// Ensure the db directory exists
const dbDir = path.join(__dirname, '../../db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Database connection helper
const getDb = async () => {
  return open({
    filename: path.join(dbDir, 'tokens.db'),
    driver: sqlite3.Database
  });
};

// Initialize database and create tables if they don't exist
const initDatabase = async () => {
  const db = await getDb();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      user_id TEXT PRIMARY KEY,
      token_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.close();
};

// Save token to database
const saveTokenToDatabase = async (userId, tokenData) => {
  const db = await getDb();
  
  try {
    await db.run(`
      INSERT OR REPLACE INTO tokens (user_id, token_data, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `, [userId, JSON.stringify(tokenData)]);
  } finally {
    await db.close();
  }
};

// Get token from database
const getTokenFromDatabase = async (userId) => {
  const db = await getDb();
  
  try {
    const row = await db.get('SELECT token_data FROM tokens WHERE user_id = ?', [userId]);
    return row ? JSON.parse(row.token_data) : null;
  } finally {
    await db.close();
  }
};

// Delete token from database
const deleteTokenFromDatabase = async (userId) => {
  const db = await getDb();
  
  try {
    await db.run('DELETE FROM tokens WHERE user_id = ?', [userId]);
  } finally {
    await db.close();
  }
};

// Initialize the database when this module is imported
initDatabase().catch(console.error);

module.exports = {
  saveTokenToDatabase,
  getTokenFromDatabase,
  deleteTokenFromDatabase,
  initDatabase
};