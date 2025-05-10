"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbURI = process.env.DB_URI;
if (dbURI === undefined) {
    throw new Error('Missing DB URI');
}
const config = {
    port: parseInt(process.env.APP_PORT || '3000', 10),
    dbUrl: dbURI,
};
exports.default = config;
