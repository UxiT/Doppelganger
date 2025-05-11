import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { User, Intent, userVaultMapping } from './models.js';
dotenv.config();

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
        const { username, password, email, internalWallet } = req.body;
        const user = await User.create({ username, password, email, internalWallet });
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

        if (!user || user.password !== password) {
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
        const { amount } = req.body;
        const userId = req.user.userId;
        const intent = await Intent.create({ userId, amount });
        const mapping = await userVaultMapping(userId);

        res.status(200).json({
            message: 'Intent created successfully',
            intentId: intent.id,
            vaults: {
                internalAddress: mapping.internalVaultAddress,
                externalAddress: mapping.externalVaultAddress
            }
        });
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

// Get vaults for specific intent
router.get('/intents/:intentId/vaults', authenticateToken, async (req, res) => {
    try {
        const { intentId } = req.params;
        const userId = req.user.userId;

        const intent = await Intent.findOne({
            where: { id: intentId, userId }
        });

        if (!intent) {
            return res.status(404).json({ message: 'Intent not found' });
        }

        const mapping = await userVaultMapping(userId);

        res.status(200).json(mapping);
    } catch (error) {
        console.error('Vaults fetch error:', error);
        res.status(500).json({ message: 'Error fetching vaults' });
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

app.use(express.json())
app.use('/api', router)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
