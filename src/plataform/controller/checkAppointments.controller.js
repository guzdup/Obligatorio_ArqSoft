const Employee = require("../../authentication_System/modules/employee.model.js");
const User = require('../../authentication_System/modules/user.model');
const Appointment = require("../models/appointment.model");
const secretKey = require('../../config.js')
const jwt = require('jsonwebtoken')
const { validateDateFormat } = require("../validation/appointmentValidations");
const badDateFormat = "El formato de fecha debe ser dd/mm/aaaa"

const getAppointmentsByDateAndDoc = async (req, res) => {

    try {
        const { dateI, dateF } = req.query;
  
        if (!dateI || !dateF) {
            return res.status(400).json({ message: "Debe proporcionar ambas fechas." });
        }

        if(!validateDateFormat(dateI) || !validateDateFormat(dateF)){
            return res.status(400).json({message: badDateFormat})
        }

        const [dayI, monthI, yearI] = dateI.split('/');
        const selectedDateI = new Date(`${monthI}/${dayI}/${yearI}`);
        selectedDateI.setMinutes(selectedDateI.getMinutes() - selectedDateI.getTimezoneOffset());

        const [dayF, monthF, yearF] = dateF.split('/');
        const selectedDateF = new Date(`${monthF}/${dayF}/${yearF}`);
        selectedDateF.setMinutes(selectedDateF.getMinutes() - selectedDateF.getTimezoneOffset());

        var token = req.headers.authorization;
        token = token ? token.replace("Bearer ", "") : null;
        const tokenDecoded = jwt.verify(token, secretKey);
        const user = await User.findOne({ documentID: tokenDecoded.document });

        if (user.role === 'u') {
            const userAppointments = await Appointment.find({
                date: {
                    $gte: selectedDateI,
                    $lte: selectedDateF
                },
                userID: user.documentID
            }).select('documentID date time userID -_id');
            if (userAppointments.length === 0) {
                return res.json({ message: "No se encontraron citas de este paciente entre las fechas proporcionadas." });
            }
            res.json(userAppointments);
        }
        else if (user.role === 'p') {
            const proffesionalAppointments = await Appointment.find({
                date: {
                    $gte: selectedDateI,
                    $lte: selectedDateF
                },
                documentID: user.documentID
            }).select('documentID date time userID -_id')
            if (proffesionalAppointments.length === 0) {
                return res.json({ message: "No se encontraron citas entre las fechas proporcionadas." });
            }
            res.json(proffesionalAppointments);
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las citas pendientes", error: error.message });
    }
};

module.exports = getAppointmentsByDateAndDoc