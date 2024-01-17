const Appointment = require('../models/appointment.model.js')
const secretKey = require('../../config.js')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const nonExistentDocumentError = "No existe un profesional con ese documento"
const badDateFormat = "El formato de fecha debe ser dd/mm/aaaa"
const invalidTimeFormat = "El formato de hora es invalido"
const nonDisponibilityError = "El profesional no tiene disponibilidad en esa fecha y horario"
const { validateExistingDoctor, validateDateFormat, validateTimeFormat, validateDisponibility } = require('../validation/appointmentValidations.js')
const User = require('../../authentication_System/modules/user.model.js')

const registerAppointment = async (req, res) => {
    const { documentID, date, time, state } = req.body;

    let existingDoc
    try {
        existingDoc = await validateExistingDoctor(documentID)
        if (!existingDoc) {
            return res.status(400).json({ error: nonExistentDocumentError });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error en la creacion de la cita" });
    }

    if (!validateDateFormat(date)) {
        return res.status(400).json({ error: badDateFormat });
    }
    const splitedDate = date.split('/');
    const dateToSave = splitedDate[2] + '-' + splitedDate[1] + '-' + splitedDate[0];

    if (!validateTimeFormat(time)) {
        console.log(time)
        return res.status(400).json({ error: invalidTimeFormat });
    }
    
    const [hours, minutes] = time.split(":");
    const numericHours = parseInt(hours, 10);

    if (numericHours < 9 || numericHours > 18 || (numericHours == 18 && minutes == "30")) {
        return res.status(400).json({ error: "El horario de atención es de 9 a 18 horas" });
    }
    if (minutes != "00" && minutes != "30") {
        return res.status(400).json({ error: "Solo se aceptan horarios exactos o y media, por ejemplo 09:00 y 09:30" });
    }

    const appointmentData = {
        documentID,
        date: dateToSave,
        time,
        state
    }

    const isAppointmentUnavailable = await validateDisponibility(appointmentData);
    if (isAppointmentUnavailable) {
        return res.status(400).json({ error: nonDisponibilityError });
    }

    try {
        var token = req.headers.authorization;
        token = token ? token.replace("Bearer ", "") : null;
        const tokenDecoded = jwt.verify(token, secretKey);
        const user = await User.findOne({ documentID: tokenDecoded.document });
        const userEmail = user.email;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            secure: true,
            auth: {
                user: 'obliarqui@gmail.com',
                pass: 'dmkgjwsrmcwmzabi',
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: 'obliarqui@gmail.com',
            to: userEmail,
            subject: 'Cita Programada',
            text: `Usted ha reservaod una cita con ${existingDoc.lastName}, para el dia ${date} a las ${time}.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo de verificación:', error);
            } else {
                console.log('Correo de creacion de cita enviado:', info.response);
            }
        });


        appointmentData.userID = user.documentID;
        const newAppointment = new Appointment(appointmentData)
        await newAppointment.save()

        res.status(200).json({ message: "Cita creada con exito" })
    }
    catch (error) {
        res.status(500).json({ message: "Error al crear cita", error: error })
    }
}

module.exports = registerAppointment