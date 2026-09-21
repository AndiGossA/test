import { openDB } from 'idb';

/**
 * IndexedDB access layer.
 *
 * Every store is keyed by a string id and carries a `planId`, so a future plan
 * (2028 and beyond) is new rows rather than a new schema. The UI only renders
 * the current plan, which `CURRENT_PLAN_ID` names.
 */

export const DB_NAME = 'lifestyle-plan';
export const DB_VERSION = 1;
export const CURRENT_PLAN_ID = 'plan-2026-2027';

/** Stores that hold plan content, each indexed by planId. */
export const STORES = [
  'plans',
  'periods',
  'vision',
  'budgetCategories',
  'financialMilestones',
  'personalGoals',
  'quarterlyCheckins',
  'careerState',
  'careerMilestones',
  'careerActions',
  'skills',
  'learningItems',
  'skillMilestones',
  'reviewDefinitions',
  'reviewLogs',
  'changelog',
];

let dbPromise;

function connect() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        for (const name of STORES) {
          if (db.objectStoreNames.contains(name)) continue;
          const store = db.createObjectStore(name, { keyPath: 'id' });
          // 'plans' is the only store not scoped to a parent plan.
          if (name !== 'plans') store.createIndex('planId', 'planId');
        }
      },
    });
  }
  return dbPromise;
}

/** Every row in a store belonging to the given plan, in `order` order. */
export async function listByPlan(store, planId = CURRENT_PLAN_ID) {
  const db = await connect();
  const rows = await db.getAllFromIndex(store, 'planId', planId);
  return rows.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function get(store, id) {
  const db = await connect();
  return db.get(store, id);
}

/** Insert or replace a row. Returns the row as written. */
export async function put(store, row) {
  const db = await connect();
  const record = { planId: CURRENT_PLAN_ID, ...row };
  await db.put(store, record);
  return record;
}

/** Merge fields into an existing row. Throws if the row is missing. */
export async function patch(store, id, fields) {
  const db = await connect();
  const existing = await db.get(store, id);
  if (!existing) throw new Error(`${store}/${id} not found`);
  const updated = { ...existing, ...fields };
  await db.put(store, updated);
  return updated;
}

export async function remove(store, id) {
  const db = await connect();
  await db.delete(store, id);
}

/** Write many rows in one transaction. */
export async function putMany(store, rows) {
  const db = await connect();
  const tx = db.transaction(store, 'readwrite');
  await Promise.all([
    ...rows.map((row) => tx.store.put({ planId: CURRENT_PLAN_ID, ...row })),
    tx.done,
  ]);
  return rows.length;
}

export async function countByPlan(store, planId = CURRENT_PLAN_ID) {
  const db = await connect();
  return db.countFromIndex(store, 'planId', planId);
}

/** Whole-database dump, for the JSON export in Settings. */
export async function exportAll() {
  const db = await connect();
  const data = {};
  for (const name of STORES) data[name] = await db.getAll(name);
  return { exportedAt: new Date().toISOString(), version: DB_VERSION, data };
}

/** Replace the database contents with a previous export. */
export async function importAll(payload) {
  const data = payload?.data;
  if (!data) throw new Error('Not a recognised export file');
  const db = await connect();
  const tx = db.transaction(STORES, 'readwrite');
  for (const name of STORES) {
    await tx.objectStore(name).clear();
    for (const row of data[name] ?? []) await tx.objectStore(name).put(row);
  }
  await tx.done;
}

/** Wipe everything. The caller is responsible for confirming first. */
export async function clearAll() {
  const db = await connect();
  const tx = db.transaction(STORES, 'readwrite');
  await Promise.all([...STORES.map((n) => tx.objectStore(n).clear()), tx.done]);
}
