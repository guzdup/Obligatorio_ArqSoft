const {DataTypes} = require('sequelize');
const sequelize = require('../database/sequelize');

const vaccineEnabled = sequelize.define('vaccine', {
    nameCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    comercialName: {
        type: DataTypes.STRING,
    },
    laboratory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
});

module.exports = vaccineEnabled;