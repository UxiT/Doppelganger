import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { sequelize } from './models.js';

dotenv.config();

async function migrate() {
    try {
        // Sync all models with database
        await sequelize.sync({ force: true });
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate().then(() => {
    console.log('Migration completed successfully');
});
