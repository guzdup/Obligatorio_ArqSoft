const bcrypt = require('bcrypt')
const Employee = require('../modules/employee.model.js');
const errorEmployees = "Error al obtener a los funcionarios";

const readEmployees = async (req, res) => { 
    try {
        const employees = await Employee.find();
        res.json(employees);
    } 
    catch (error) {
        res.status(500).json({ error: errorEmployees });
    }
}

module.exports = readEmployees