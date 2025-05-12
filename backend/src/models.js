import { Sequelize, DataTypes } from 'sequelize';
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
    {
        underscored: true
    }
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
        pool: {
            type: DataTypes.ENUM('internal', 'external'),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        underscored: true
    }
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
    {
        underscored: true
    }
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
        transactionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        withdrawWalletAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        withdrawPermitted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        permitTransactionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        underscored: true
    }
);

// Define relationships
User.hasMany(Intent);
Intent.belongsTo(User);


const userVaultMapping = async (userId) => {
    let mapping = await VaultMapping.findOne({ where: { userId } });
    if (!mapping) {
        const internalVault = await Vault.findOne({
            where: { pool: 'internal' },
            order: sequelize.random()
        });
        const externalVault = await Vault.findOne({
            where: { pool: 'external' },
            order: sequelize.random()
        });

        if (!internalVault || !externalVault) {
            throw new Error('No vaults found');
        }

        mapping = await VaultMapping.create({
            userId,
            internalVaultId: internalVault.id,
            externalVaultId: externalVault.id
        });
    }

    const internalVault = await Vault.findOne({ where: { id: mapping.internalVaultId } });
    const externalVault = await Vault.findOne({ where: { id: mapping.externalVaultId } });

    if (!internalVault || !externalVault) {
        throw new Error('Vault not found');
    }

    return {
        internalVaultAddress: internalVault.address,
        externalVaultAddress: externalVault.address
    };
}

export {
    sequelize,
    User,
    Vault,
    VaultMapping,
    Intent,
    userVaultMapping
};
