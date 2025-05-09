import {DataTypes, Model} from "sequelize";

class SmartContract extends Model {
    public address!: string;
    public balance!: number;
    public lastCallAt: Date;
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
