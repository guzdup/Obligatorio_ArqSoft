const bcrypt = require('bcrypt')
const Employee = require('../modules/employee.model.js');
const errorDeleteEmployee = "Error al eliminar al funcionario";
const correctDeleteEmployee = "Empleado eliminado correctamente";

const deleteEmployee = async (req, res) => { 
    try {
        const { documentID } = req.query;
        console.log(documentID);

        if (!documentID) {
            return res.status(400).json({ error: 'ID del empleado no proporcionado' });
        }
        const findEmployee = await Employee.findOne({documentID: documentID});
        if (findEmployee) {
            const deletedEmployee = await Employee.deleteOne({documentID: documentID});
            if (!deletedEmployee) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }
        }
        else {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        
        res.json({ message: correctDeleteEmployee });
    } 
    catch (error) {
        res.status(500).json({ error: errorDeleteEmployee });
    }
}

module.exports = deleteEmployee