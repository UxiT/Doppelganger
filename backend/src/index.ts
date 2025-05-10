import express from 'express';
import {Sequelize} from 'sequelize';
import router from'./routes';
import config from "./config";

const app = express()

app.use(express.json())
app.use('/api', router)

const sequelize = new Sequelize(config.dbUrl)

sequelize.authenticate()
    .then(() => console.log('Connected to DB'))
    .catch((err) => { throw err })

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
})