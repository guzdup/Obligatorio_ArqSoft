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

        const userAppointments = await Appointment.aggregate([
            {
                $match: {
                    date: {
                        $gte: selectedDateI,
                        $lte: selectedDateF
                    },
                    userID: user.documentID
                }
            },
            {
                $group: {
                    _id: "$documentID",
                    cantidad: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    profesional: "$_id",
                    cantidad: 1
                }
            }
        ]);
        
        if (userAppointments.length === 0) {
            return res.json({ message: "No se encontraron citas de este paciente entre las fechas proporcionadas." });
        }
        res.json(userAppointments);

        
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las citas", error: error.message });
    }
};

module.exports = getAppointmentsByDateAndDoc