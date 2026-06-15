const { DataTypes } = require('sequelize');
const sequelize  = require('../config/database');


const Comment = sequelize.define(
    'Comment',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,

        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

    }
)

module.exports = Comment;