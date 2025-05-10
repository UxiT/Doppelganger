import dotenv from 'dotenv';
dotenv.config();
const dbURI = process.env.DB_URI;
if (dbURI === undefined) {
    throw new Error('Missing DB URI');
}
const config = {
    port: parseInt(process.env.APP_PORT || '3000', 10),
    dbUrl: dbURI,
};
export default config;
