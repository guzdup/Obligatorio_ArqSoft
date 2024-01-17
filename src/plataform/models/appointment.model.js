const mongoose = require('mongoose')
const {plataformDbConnection} = require('../../bdMongo.js')

const appointmentSchema = new mongoose.Schema({
    documentID:{
        type: Number,
        required: true,
        ref: 'UserProfessional'
    },
    date:{
        type: Date,
        required: true,
        validate: {
            validator: function (date) {
              return date > new Date();
            },
            message: 'La fecha debe ser mayor al dia de hoy.',
          },
    },
    time:{
        type: String,
        required: true
    },
    state:{
        type: String,
        default: "Pendiente"
    },
    userID:{
        type: Number,
        required: false
    },
    note: {
        type: String,
        required: false
    }
})

const Appointment = plataformDbConnection.model('Appointment', appointmentSchema);

module.exports = Appointment