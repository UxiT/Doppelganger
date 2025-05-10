"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const config_1 = __importDefault(require("../config"));
const sequelize = new sequelize_2.Sequelize(config_1.default.dbUrl);
class SmartContract extends sequelize_1.Model {
}
SmartContract.init({
    address: { type: sequelize_1.DataTypes.UUID, primaryKey: true, autoIncrement: false },
    balance: { type: sequelize_1.DataTypes.DECIMAL, allowNull: false },
    lastCallAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, {
    sequelize,
    modelName: 'SmartContract'
});
exports.default = SmartContract;
