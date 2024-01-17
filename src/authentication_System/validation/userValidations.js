//const { response } = require("express");
const Employee = require('../modules/employee.model.js');
const User = require('../modules/user.model.js')
const axios = require("axios");


const imageSize = "La imagen supera 1 MB de tamaño"
const requireImage = "La imagen es obligatoria y no fue proporcionada"
const roles = ["admin", "u", "p", "a"]
const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 1MB en bytes

function validateRequiredFields(userData) {
    const { firstName, lastName, documentID, password, confirmPassword, dateOfBirth, address, telephone, email, role } = userData;
    if (!firstName || !lastName || !documentID || !password || !confirmPassword || !dateOfBirth || !address || !telephone || !email || !role) {
        return false
    }
    return true
}

function validateLengthPassword(password) {
    if (password.length < 8) {
        return false
    }
    return true
}

function validateConfirmPassword(password, confirmPassword) {
    if (password !== confirmPassword) {
        return false
    }
    return true;
}

function validateDateOfBirth(dateOfBirth) {
    const dateOfBirthPattern = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateOfBirthPattern.test(dateOfBirth)) {
        return false;
    }
    return true
}

function validateEmailFormat(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        return false;
    }
    return true
}

function validateDocumentFormat(documentID) {
    const documentIDPattern = /^\d+$/;
    if (!documentIDPattern.test(documentID)) {
        return false;
    }
    return true
}

function validateRole(role) {
    return roles.includes(role)
}

async function validateRepeatedEmail(email){
    const emailFound = await User.findOne({ email: email })
    return emailFound
}

async function validateRepeatedDoc(document){
    const documentFound = await User.findOne({ documentID: document })
    return documentFound
}

async function validateExistingAsEmployee(document){
    const employeeFound = await Employee.findOne({ documentID: document})
    return employeeFound
}


async function validatePhoneNumber(phoneNumber) {
    const apiURL = 'http://apilayer.net/api/validate';
    const accessKey = '26bde74d95a94fa0eebbb174d8b61c6d'; 

    try {
        const response = await axios.get(apiURL, {
            params: {
                access_key: accessKey,
                number: phoneNumber,
                format: 1,
                country_code: 'UY' 
            }
        });

        const data = response.data;
        if (data.valid) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

async function userVerified(userFound, res) {
    if (!userFound.verified) {
        return false;
    }
    return true
}

module.exports = {
    validateRequiredFields,
    validateEmailFormat,
    validateConfirmPassword,
    validateDateOfBirth,
    validateDocumentFormat,
    validateRepeatedEmail,
    validateRole,
    validatePhoneNumber,
    validateLengthPassword,
    validatePhoneNumber,
    userVerified,
    validateRepeatedDoc,
    validateExistingAsEmployee
};
