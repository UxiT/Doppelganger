import dotenv from 'dotenv'

dotenv.config()

interface Config {
    port: number
    dbUrl: string
}

const dbURI = process.env.DB_URI

if (dbURI === undefined) {
    throw new Error('Missing DB URI')
}

const config: Config = {
    port: parseInt(process.env.APP_PORT || '3000', 10),
    dbUrl: dbURI,
}

export default config
