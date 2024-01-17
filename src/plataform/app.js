const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const createAppointment = require('./routes/createAppointment.route.js')
const getAppointments = require('./routes/getAppointments.route.js')
const getAppointmentsByDateAndDoc = require('./routes/getAppsByDateAndDoc.route.js');
const createSheduleForVaccination = require('./routes/createSheduleForVaccination.route.js');
const getAppointmentsForDocBetweenDates = require('./routes/getAppointmentsForDocBetweenDates.route.js');
const certification = require('./routes/getVaccineCertification.route.js')
const addNoteToAppointment = require('./routes/addNoteAppointment.route.js');
const checkAppointments = require('./routes/checkAppointments.routes.js');
const checkUserAppointments = require('./routes/checkUserAppointments.route.js');

app.use(express.json());
app.use(cookieParser());
app.use("/api", createAppointment)
app.use("/api", getAppointments)
app.use("/api", getAppointmentsByDateAndDoc)
app.use("/api", createSheduleForVaccination)
app.use("/api", getAppointmentsForDocBetweenDates)  
app.use("/api", certification)
app.use("/api", getAppointmentsForDocBetweenDates) 
app.use("/api", addNoteToAppointment);
app.use("/api", checkAppointments);
app.use("/api", checkUserAppointments);
module.exports = app;