const {DataTypes} = require('sequelize');
const sequelize = require('../database/sequelize');

const certificate = sequelize.define('certificate', {
    uniqueCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    documentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nameVaccine: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});
module.exports = certificate;