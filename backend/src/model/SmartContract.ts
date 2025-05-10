import { DataTypes, Model } from "sequelize";
import { Sequelize } from "sequelize"
import config from "../config";

const sequelize = new Sequelize(config.dbUrl)

class SmartContract extends Model {
    public address!: string;
    public balance!: number;
    public lastCallAt!: Date | null;
}

SmartContract.init({
    address: {type: DataTypes.UUID, primaryKey: true, autoIncrement: false},
    balance: {type: DataTypes.DECIMAL, allowNull: false},
    lastCallAt: {type: DataTypes.DATE, allowNull: true},
}, {
    sequelize,
    modelName: 'SmartContract'
})

export default SmartContract;
