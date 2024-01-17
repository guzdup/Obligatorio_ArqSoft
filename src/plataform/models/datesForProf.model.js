const mongoose = require('mongoose')

const datesForProf = new mongoose.Schema({
    documentID:{
        type: Number,
        required: true,
        unique: true
    },
    dateFrom:{
        type: Date,
        required: true,
        validate: {
            validator: function (date) {
              return date > new Date();
            },
            message: 'La fecha debe ser mayor al dia de hoy.',
          },
    },
    dateTo:{
        type: Date,
        required: true,
        validate: {
            validator: function (date) {
              return date > new Date();
            },
            message: 'La fecha debe ser mayor al dia de hoy.',
          
        },
    },
})
const Date = mongoose.model('Date', datesForProf, 'dates');

module.exports = Date;