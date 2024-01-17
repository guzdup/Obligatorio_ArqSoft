const Employee = require("../../authentication_System/modules/employee.model.js");
const Appointment = require("../models/appointment.model");
const secretKey = require('../../config.js')
const jwt = require('jsonwebtoken')
const { validateDateFormat } = require("../validation/appointmentValidations");
const badDateFormat = "El formato de fecha debe ser dd/mm/aaaa"

const getAppointmentsByDateAndDoc = async (req, res) => {

    try {
        const { date } = req.query;
 
        if (!date) {
            return res.status(400).json({ message: "Debe proporcionar una fecha." });
        }

        if(!validateDateFormat(date)){
            return res.status(400).json({message: badDateFormat})
        }

        const [day, month, year] = date.split('/');
        const selectedDate = new Date(`${month}/${day}/${year}`);
        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());

        var token = req.headers.authorization;
        token = token ? token.replace("Bearer ", "") : null;
        const tokenDecoded = jwt.verify(token, secretKey);
        const professional = await Employee.findOne({ documentID: tokenDecoded.document });
        const professionalID = professional.documentID;

        const pendingAppointments = await Appointment.find({
            state: 'Pendiente',
            date: selectedDate.getTime(),
            documentID: professionalID
        }).select('documentID date time userID -_id')
        .populate({
            path: 'userID',
            select: 'firstName lastName -_id'
          });

        if (pendingAppointments.length === 0) {
            return res.json({ message: "No se encontraron citas pendientes para la fecha y el doctor especificados." });
        }

        res.json(pendingAppointments);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las citas pendientes", error: error.message });
    }
};

module.exports = getAppointmentsByDateAndDoc