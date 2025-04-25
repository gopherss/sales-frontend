import { openDB } from 'idb';

const DB_NAME = 'invoiceConfig';
const STORE_NAME = 'company';

const getDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
};

export const saveCompanyName = async (name: string) => {
    const db = await getDB();
    await db.put(STORE_NAME, name, 'name');
};

export const saveCompanyLogo = async (base64: string) => {
    const db = await getDB();
    await db.put(STORE_NAME, base64, 'logo');
};

export const getCompanyName = async () => {
    const db = await getDB();
    return (await db.get(STORE_NAME, 'name')) || '';
};

export const getCompanyLogo = async () => {
    const db = await getDB();
    return (await db.get(STORE_NAME, 'logo')) || '';
};
