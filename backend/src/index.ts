import express from 'express';
import { Sequelize } from 'sequelize';
import cors from 'cors';

import router from'./routes';
import config from "./config";

const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}

const app = express()
app.use(cors(corsOptions))

app.use(express.json())
app.use('/api', router)

const sequelize = new Sequelize(config.dbUrl)

sequelize.authenticate()
    .then(() => console.log('Connected to DB'))
    .catch((err) => { throw err })

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
})