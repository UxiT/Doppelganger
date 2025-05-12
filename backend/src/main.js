import express from 'express';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { User, Intent, userVaultMapping } from './models.js';

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', '*'],
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}

const app = express()
app.use(cors(corsOptions))

const router = express.Router();

// Add JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        const userRow = await User.findOne({ where: { id: user.userId } });
        if (!userRow) {
            return res.status(403).json({ message: 'Invalid user' });
        }

        req.user = user;
        next();
    });
};

// Middleware to log request path and time
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Start ${req.method} ${req.path}`);
    next();
    console.log(`[${timestamp}] End ${req.method} ${req.path} - Status: ${res.statusCode}`);
});


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
        const { amount, transactionId, withdrawWalletAddress } = req.body;

        if (!withdrawWalletAddress) {
            return res.status(422).json({ message: 'withdrawWalletAddress field is required' });
        }
        if (!amount) {
            return res.status(422).json({ message: 'amount field is required' });
        }

        const userId = req.user.userId;
        const intent = await Intent.create({ userId, amount, transactionId, withdrawWalletAddress });
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
router.put('/intents/:intentId/properties', authenticateToken, async (req, res) => {
    try {
        const { intentId } = req.params;
        const { isWithdrawn } = req.body;
        const userId = req.user.userId;

        const intent = await Intent.findOne({
            where: { id: intentId, userId }
        });

        if (!intent) {
            return res.status(404).json({ message: 'Intent not found' });
        }

        await intent.update({ isWithdrawn });
        res.status(200).json({ message: 'Properties updated successfully' });
    } catch (error) {
        console.error('Properties update error:', error);
        res.status(500).json({ message: 'Error updating properties' });
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

router.get('/vaults', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const mapping = await userVaultMapping(userId);

        if (!mapping) {
            return res.status(404).json({ message: 'Vault mapping not found' });
        }

        res.status(200).json(mapping);
    } catch (error) {
        console.error('Vaults fetch error:', error);
        res.status(500).json({ message: 'Error fetching vaults' });
    }
});

router.post("/mint", authenticateToken, async (req, res) => {
    try {
        const { address, amount } = req.query;

        if (!address) {
            return res.status(400).json({ message: 'Address parameter is required' });
        }

        const vaultTokenAddr = "0x3Ee8Ff2865d5202942c65e91BA537cc815dFA0Fd"
        const abi = [
            "function mint(address to, uint256 amount)"
        ]

        const vaultTokenContract = new ethers.Contract(vaultTokenAddr, abi, signer);

        const tx = await vaultTokenContract.mint(address, amount);
        const receipt = await tx.wait();

        res.status(200).json({ message: 'Minting successful', txHash: tx.hash });
    } catch (error) {
        console.error('Mint error:', error);
        res.status(500).json({ message: 'Error minting' });
    }
});

app.use(express.json())
app.use('/api', router)

import { setupListener } from './listener.js';
await setupListener();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
