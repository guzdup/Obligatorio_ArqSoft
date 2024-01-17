const mongoose = require('mongoose');
const { usersDbConnection} = require('../../bdMongo');

const { BOOLEAN } = require('sequelize');

const employeeSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    }, 
    documentID:{
        type: Number,
        required: true,
        unique: true
    },
    dateOfEntry:{
        type: Date,
        required: false,
        validate: {
            validator: function (date) {
              return date < new Date();
            },
            message: 'La fecha de nacimiento debe ser anterior a la fecha actual.',
          },
    },
    telephone: {
        type: Number,
        required: true
    },
    altTelephone: {
        type: Number,
        required: false
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    specialty:{
        type: String,
        required: false,
    },
    professionalDoctor:{
        type: Boolean,
        required: true
    },
    active:{
        type: Boolean,
        default: true
    },
    role:{
        type: String,
        enum: ['p', 'a'],
        required: false
    },
})

const Employee = usersDbConnection.model('Employee', employeeSchema);

module.exports = Employee;