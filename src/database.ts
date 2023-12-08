import { getDatabase } from 'firebase/database';
import { app } from './auth';

const db = getDatabase(app);

export { db };
export default db;
