const Appointment = require("../models/appointment.model")
const Employee = require("../../authentication_System/modules/employee.model.js");
const User = require("../../authentication_System/modules/user.model.js");


async function validateExistingDoctor(document) {
    const docFound = await Employee.findOne({ documentID: document })
    if (docFound) {
        if (docFound.professionalDoctor) {
            return docFound
        }
        else {
            return NULL;
        }
    }
    return docFound;
}

function validateDateFormat(date){
    const dateOfBirthPattern = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateOfBirthPattern.test(date)) {
        return false;
    }
    return true
}

function validateTimeFormat(time){
    const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return timePattern.test(time)
}

async function validateDisponibility(appointmentData){
    const { documentID, date, time } = appointmentData;

    const existingAppointment = await Appointment.findOne({ documentID, date, time });

    return existingAppointment !== null;
}

async function validationDateInitWithDateFinish(dateI, dateF) {
    return dateI <= dateF;
}

async function validationDateInitWithActual(dateI) {
    const today = new Date();
    return dateI >= today;
}

module.exports = {
    validateExistingDoctor,
    validateDateFormat,
    validateTimeFormat,
    validateDisponibility,
    validationDateInitWithDateFinish,
    validationDateInitWithActual
}