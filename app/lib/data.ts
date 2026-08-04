import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function readData<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function writeData<T>(filename: string, data: T[]): void {
  fs.writeFileSync(path.join(DATA_DIR, `${filename}.json`), JSON.stringify(data, null, 2));
}

export function addItem<T extends { id: number }>(filename: string, item: Omit<T, 'id'>): T {
  const items = readData<T>(filename);
  const id = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  const newItem = { ...item, id } as T;
  items.push(newItem);
  writeData(filename, items);
  return newItem;
}

export function updateItem<T extends { id: number }>(filename: string, id: number, updates: Partial<T>): T | null {
  const items = readData<T>(filename);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  writeData(filename, items);
  return items[index];
}

export function deleteItem<T extends { id: number }>(filename: string, id: number): boolean {
  const items = readData<T>(filename);
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  writeData(filename, filtered);
  return true;
}
