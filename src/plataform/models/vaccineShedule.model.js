const mongoose = require('mongoose')
const {plataformDbConnection} = require('../../bdMongo.js')

const vaccineSheduleSchema = new mongoose.Schema({
    documentID:{
        type: Number,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    telephone: {
        type: Number,
        required: true
        
    },vaccines: [{
        vacunatoryCenter: {
            type: String,
            required: false,
            default: "V1"
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
        direction:{
            type: String,
            required: true
        },
        vaccine:{
            type: String,
            required: true
        },
        state:{
            type: String,
            default: "Pendiente"
        }
    }]
    

})

const VaccineShedule = plataformDbConnection.model('VaccineShedule', vaccineSheduleSchema);
module.exports = VaccineShedule;