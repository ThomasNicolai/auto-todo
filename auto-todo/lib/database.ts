import * as SQLite from 'expo-sqlite';

export type Habit = {
  id: number;
  name: string;
  created_at: string;
};

export type Completion = {
  id: number;
  habit_id: number;
  date: string;
};

let db: SQLite.SQLiteDatabase | null = null;

function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('habits.db');
  }
  return db;
}

export function initDb(): void {
  const database = getDb();
  database.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      UNIQUE(habit_id, date),
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
    );
  `);
}

export function getAllHabits(): Habit[] {
  return getDb().getAllSync<Habit>(
    'SELECT id, name, created_at FROM habits ORDER BY created_at ASC, id ASC'
  );
}

export function getHabit(id: number): Habit | null {
  return getDb().getFirstSync<Habit>(
    'SELECT id, name, created_at FROM habits WHERE id = ?',
    [id]
  );
}

export function insertHabit(name: string): number {
  const today = new Date().toISOString().split('T')[0];
  const result = getDb().runSync(
    'INSERT INTO habits (name, created_at) VALUES (?, ?)',
    [name, today]
  );
  return result.lastInsertRowId;
}

export function updateHabit(id: number, name: string): void {
  getDb().runSync('UPDATE habits SET name = ? WHERE id = ?', [name, id]);
}

export function deleteHabit(id: number): void {
  getDb().runSync('DELETE FROM habits WHERE id = ?', [id]);
}

export function getCompletionsForHabit(habitId: number): Completion[] {
  return getDb().getAllSync<Completion>(
    'SELECT id, habit_id, date FROM completions WHERE habit_id = ? ORDER BY date ASC',
    [habitId]
  );
}

export function getCompletionsForDate(date: string): Completion[] {
  return getDb().getAllSync<Completion>(
    'SELECT id, habit_id, date FROM completions WHERE date = ?',
    [date]
  );
}

export function toggleCompletion(habitId: number, date: string): void {
  const database = getDb();
  const result = database.runSync(
    'INSERT OR IGNORE INTO completions (habit_id, date) VALUES (?, ?)',
    [habitId, date]
  );
  if (result.changes === 0) {
    database.runSync(
      'DELETE FROM completions WHERE habit_id = ? AND date = ?',
      [habitId, date]
    );
  }
}

export function isCompleted(habitId: number, date: string): boolean {
  const row = getDb().getFirstSync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM completions WHERE habit_id = ? AND date = ?',
    [habitId, date]
  );
  return (row?.cnt ?? 0) > 0;
}
