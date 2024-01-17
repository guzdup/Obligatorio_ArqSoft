const Appointment = require('../models/appointment.model.js')
const secretKey = require('../../config.js')
const jwt = require('jsonwebtoken')
const { validateDateFormat } = require("../validation/appointmentValidations");

const errorToAddNote = "Eror al agregar una nota a la cita";
const badDateFormat = "El formato de fecha debe ser dd/mm/aaaa";
const notFoundAppointment = "No se encontro una cita para ese paciente en esa fecha";
const notCompleteInformation = "Debe proporcionar una fecha, un documento del paciente y una nota.";

const addNoteToAppointment = async (req, res) =>  {
    const { date, userID, note } = req.body;

    if (!date || !userID || !note) {
        return res.status(400).json({ message:  notCompleteInformation });
    }
    
    try {
        if (!validateDateFormat(date)) {
            return res.status(400).json({ error: badDateFormat });
        }

        const queryRequestTimeStamp = new Date(); 

        const [day, month, year] = date.split('/');
        const selectedDate = new Date(`${month}/${day}/${year}`);
        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());

        const appointment = await Appointment.findOne({ date: selectedDate, userID: userID });
        if (appointment) {
            appointment.note = note;
            appointment.save();

            const queryResponseTimeStamp = new Date();
            const queryProcessingTime = queryResponseTimeStamp - queryRequestTimeStamp; 

            const responseWithTimestamps = {
                appointment,
                "Query Request TimeStamp": queryRequestTimeStamp,
                "Query Response TimeStamp": queryResponseTimeStamp,
                "Query Processing Time": queryProcessingTime
            };

            res.json(responseWithTimestamps);
        }
        else {
            return res.status(400).json({ error: notFoundAppointment })
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: errorToAddNote });
    }
}

module.exports = addNoteToAppointment