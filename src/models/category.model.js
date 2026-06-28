const { DataTypes } = require('sequelize');
const sequelize  = require('../config/database');



const Category = sequelize.define(
    'Category',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,

        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

    }
)

module.exports = Category;