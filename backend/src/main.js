import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import config from './config';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    {
        dialect: 'postgres',
        logging: false
    }
);

const User = sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        internalWallet: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
);

const Vault = sequelize.define(
    'vault',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        network: {
            type: DataTypes.STRING,
            defaultValue: 'siberium',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
);

const VaultMapping = sequelize.define(
    'vault_mapping',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        internalVaultId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Vault,
                key: 'id',
            },
        },
        externalVaultId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Vault,
                key: 'id',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
);

const Intent = sequelize.define(
    'intent',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        transactionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
);

const corsOptions = {
    origin: ['*'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}

const app = express()
app.use(cors(corsOptions))

const router = express.Router();

// Add JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = await User.create({ username, password, email });
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error during registration' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: 'Login successful', token, userId: user.id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

// Create new intent
router.post('/intents', authenticateToken, async (req, res) => {
    try {
        const { amount, type } = req.body;
        const userId = req.user.userId;
        const intent = await Intent.create({ userId, amount, type });
        res.status(201).json({ message: 'Intent created successfully', intentId: intent.id });
    } catch (error) {
        console.error('Intent creation error:', error);
        res.status(500).json({ message: 'Error creating intent' });
    }
});

// Add transaction ID to intent
router.post('/intents/:intentId/trans-id', authenticateToken, async (req, res) => {
    try {
        const { intentId } = req.params;
        const { transactionId } = req.body;
        const userId = req.user.userId;

        const intent = await Intent.findOne({
            where: { id: intentId, userId }
        });

        if (!intent) {
            return res.status(404).json({ message: 'Intent not found' });
        }

        await intent.update({ transactionId });
        res.status(200).json({ message: 'Transaction ID added successfully' });
    } catch (error) {
        console.error('Transaction ID update error:', error);
        res.status(500).json({ message: 'Error updating transaction ID' });
    }
});

// Get specific intent
router.get('/intents/:intentId', authenticateToken, async (req, res) => {
    try {
        const { intentId } = req.params;
        const userId = req.user.userId;

        const intent = await Intent.findOne({
            where: { id: intentId, userId }
        });

        if (!intent) {
            return res.status(404).json({ message: 'Intent not found' });
        }

        res.status(200).json(intent);
    } catch (error) {
        console.error('Intent fetch error:', error);
        res.status(500).json({ message: 'Error fetching intent' });
    }
});

// Get all intents
router.get('/intents', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const intents = await Intent.findAll({
            where: { userId }
        });
        res.status(200).json(intents);
    } catch (error) {
        console.error('Intents fetch error:', error);
        res.status(500).json({ message: 'Error fetching intents' });
    }
});

app.use('/api', router)
app.use(express.json())

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
