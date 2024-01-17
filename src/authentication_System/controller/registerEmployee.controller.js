const User = require('../modules/user.model.js')
const bcrypt = require('bcrypt')
const createAccessToken = require('../libs/jwt.js')
const Employee = require('../modules/employee.model.js');
const { validateDateOfBirth, validateLengthPassword, validateSpecialty } = require('../validation/employeeValidations.js');
const minLengthPassword = "La contraseña debe tener al menos 8 caracteres"
const dateError = "La fecha de nacimiento no cumple con el formato dd/mm/aaaa"
const administrativeWithSpecialtyError = "El empleado es administrativo no debe tener especialidad"

const registerEmp = async (req, res) => {

    const { firstName, lastName, documentID, telephone, altTelephone, email, professionalDoctor, specialty, active } = req.body;

    try {
        if(validateSpecialty(specialty, professionalDoctor)){
            return res.status(400).json({error: administrativeWithSpecialtyError})   
        }
    
        let role
        if(professionalDoctor){
            role = "p"
        }else{
            role = "a"
        }

        const userData = {
            firstName,
            lastName,
            documentID,
            dateOfEntry: Date.now(),
            telephone,
            altTelephone,
            email,
            specialty,
            professionalDoctor,
            active,
            role: role
        };

        const newUser = new Employee(userData);
        await newUser.save();

        res.json({
            message: "Empleado creado",
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            documentID: newUser.documentID,
            dateOfEntry: newUser.dateOfEntry,
            email: newUser.email,
            role: newUser.role,
            professional: newUser.professionalDoctor,
            active: newUser.active,
        });

    } catch (error) {
        res.status(500).json({ message: "Error al registrar empleado", error: error.message });
    }
}

module.exports = registerEmp