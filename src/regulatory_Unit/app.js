const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const registerVaccine = require('./routes/vaccination.route.js')
const vaccineHistory = require('./routes/vaccinationHistory.route.js')
const vaccineAdministration = require('./routes/vaccineAdministration.route.js')
const certification = require('./routes/certificationVaccine.route.js')
app.use(express.json());
app.use(cookieParser());
app.use("/api", registerVaccine)
app.use("/api", vaccineHistory)
app.use("/api", vaccineAdministration)
app.use("/api", certification)
module.exports = app;