const Appointment = require("../models/appointment.model");
const { validateExistingDoctor, validateDateFormat, validationDateInitWithDateFinish, validationDateInitWithActual} = require("../validation/appointmentValidations.js");
const { generatHours, generarCombinaciones } = require("../hoursGenerater/generatHours.js");
const badDateFormat = "El formato de fecha debe ser dd/mm/aaaa";
const nonExistentDocumentError = "No existe un profesional con ese documento"

const getAppointmentsForDocBetweenDates = async (req, res) => {

    try {
        const { dateInit, dateFinish, doctorID } = req.query;

        if (!dateInit || !dateFinish || !doctorID) {
            return res.status(400).json({ message: "Debe proporcionar ambas fechas y el ID del doctor." });
        }

        let existingDoc
        existingDoc = await validateExistingDoctor(doctorID)
        if (!existingDoc) {
            return res.status(400).json({ error: nonExistentDocumentError });
        }

        if(!validateDateFormat(dateInit) || !validateDateFormat(dateFinish)){
            return res.status(400).json({message: badDateFormat})
        }
        
        if (!validationDateInitWithDateFinish(dateInit, dateFinish)) {
            return res.status(400).json({message: "La fecha inicial debe ser menor o igual a la fecha final"})
        }

        if (!validationDateInitWithActual(dateInit)) {
            return res.status(400).json({ message: "La fecha de inicial debe ser mayor o igual a la fecha actual"})
        }

        const [dayI, monthI, yearI] = dateInit.split('/');
        const selectedDateI = new Date(`${monthI}/${dayI}/${yearI}`);
        selectedDateI.setMinutes(selectedDateI.getMinutes() - selectedDateI.getTimezoneOffset());

        const [dayF, monthF, yearF] = dateFinish.split('/');
        const selectedDateF = new Date(`${monthF}/${dayF}/${yearF}`);
        selectedDateF.setMinutes(selectedDateF.getMinutes() - selectedDateF.getTimezoneOffset());

        const startDate = new Date(selectedDateI);
        const endDate = new Date(selectedDateF);
        const timeSlots = generatHours(startDate, endDate);

        const fechas = [];
        let fechaActual = new Date(selectedDateI);
        while (fechaActual <= selectedDateF) {
            fechas.push(new Date(fechaActual));
            fechaActual.setDate(fechaActual.getDate() + 1);
        }

        const appointments = await Appointment.find({
            documentID: doctorID
        })
        const appointmentsInDate = appointments.filter(appointment => (appointment.date >= selectedDateI && appointment.date <= selectedDateF));

        const diasYhoras = generarCombinaciones(fechas, timeSlots);

        const diasYhorasNoDisponibles = [];
        for (const [dia, hora] of diasYhoras) {
            const diaf = dia.getUTCDate();
            const mes = dia.getUTCMonth() + 1;
            const anio = dia.getUTCFullYear();
            
            const fechaFormateada = `${diaf.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;
            const [dayE, monthE, yearE] = fechaFormateada.split('/');
            const selectedDateE = new Date(`${monthE}/${dayE}/${yearE}`);
            selectedDateE.setMinutes(selectedDateE.getMinutes() - selectedDateE.getTimezoneOffset());

            const citaExistente = appointmentsInDate.find(appointment => (
                appointment.date = selectedDateE && appointment.time == hora
            ));

            if (!citaExistente) {
                diasYhorasNoDisponibles.push({ dia: fechaFormateada, hora: hora });
            }
        }

        res.json(diasYhorasNoDisponibles);  
    }    
    catch (error) {
        res.status(500).json({ message: "Error al obtener la disponibilidad de citas en el rango de fechas y el doctor proporcionado", error: error.message });
    }
};

module.exports = getAppointmentsForDocBetweenDates