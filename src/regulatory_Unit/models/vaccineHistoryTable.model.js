const {DataTypes} = require('sequelize');
const sequelize = require('../database/sequelize');

const vaccineHistory = sequelize.define('vaccineHistory', {
    documentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nameVaccine: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    doctor: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        
    },
    dateAdministered: {
        type: DataTypes.TIME,
        defaultValue: null,
    },
});

module.exports = vaccineHistory;