
function validateLengthPassword(password) {
    if (password.length < 8) {
        return false
    }
    return true
}

function validateDateOfBirth(dateOfBirth) {
    const dateOfBirthPattern = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateOfBirthPattern.test(dateOfBirth)) {
        return false;
    }
    return true
}

function validateSpecialty(specialty, professionalDoctor) {
    if(!professionalDoctor){
        return specialty
    }
}


module.exports = {
    validateLengthPassword,
    validateDateOfBirth,
    validateSpecialty
}