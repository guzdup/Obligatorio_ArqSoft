const VaccineShedule = require('../models/vaccineShedule.model.js')
const secretKey = require('../../config.js')
const jwt = require('jsonwebtoken')
const User = require('../../authentication_System/modules/user.model.js')
const VaccineEnabled = require('../../regulatory_Unit/models/vaccineEnabledTable.model.js')
const VaccineHistory = require('../../regulatory_Unit/models/vaccineHistoryTable.model.js')
const {validateDocumentFormat,validatePhoneNumber,validateRepeatedEmail, validateEmailFormat, validateRepeatedDoc} = require('../../authentication_System/validation/userValidations.js')

const nodemailer = require('nodemailer')
const nonExistentDocumentError = "No existe un usuario con ese documento"
const invalidFormatEmail = "La dirección de correo electrónico no tiene un formato válido"
const invalidTelephoneNumber = "El número de teléfono no es válido"
const nonExistentEmailError = "No existe un usuario con ese correo electrónico"

const registerVaccineShedule = async (req, res) => {
    const { documentID, email, telephone, date, direction, vacunatoryCenter, state} = req.body;
    const { vaccine } = req.query;

    const vaccineActive = await VaccineEnabled.findOne({
        where: {
          nameCode: vaccine,
        },
    });

    if (!vaccineActive) {
        return res.status(400).json({ error: "La vacuna no se encuentra disponible" });
    }

    if (!validateDocumentFormat(documentID)) {
        return res.status(400).json({ error: idFormatError });
    }

    if (!validateEmailFormat(email)) {
        return res.status(400).json({ error: invalidFormatEmail });
    }

    const phoneNumber = req.body.telephone;
    const isValidPhoneNumber = await validatePhoneNumber(phoneNumber);
    if (!isValidPhoneNumber) {
        return res.status(400).json({ error: invalidTelephoneNumber });
    }
    const splitedDate = date.split('/');
    const dateToSave = splitedDate[2] + '-' + splitedDate[1] + '-' + splitedDate[0];

    let isDocumentRepeated
    try {
        isDocumentRepeated = await validateRepeatedDoc(documentID)
        if (!isDocumentRepeated) {
            return res.status(400).json({ error: nonExistentDocumentError });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al validar el documento" });
    }

    async function validateRepeatedVaccine(documentID, vaccinePushed) {
        const vaccineShedule = await VaccineShedule.findOne({ documentID: documentID });
    
        if (!vaccineShedule) {
            return false; 
        }
        const existingVaccine = vaccineShedule.vaccines.some(vaccine => vaccine.vaccine === vaccinePushed);
    
        return existingVaccine;
    }

    let isVaccineRepeated
    try{
        isVaccineRepeated = await validateRepeatedVaccine(documentID, vaccine)
        if(isVaccineRepeated){
            return res.status(400).json({ error: "Ya se encuentra agendado para esta vacuna" });
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({ error: "Error al validar la vacuna" });
    }

    if(isDocumentRepeated.email !== email){
        return res.status(400).json({ error: nonExistentEmailError });
    }
    
    try{
        async function validateRepetedDoc(document){
            const documentRep = await VaccineShedule.findOne({ documentID: document })
            return documentRep
        }

        const newVaccine = {
            vacunatoryCenter,
            date: dateToSave,
            direction ,
            vaccine,  
        };

        const existingDoc = await validateRepetedDoc(documentID)
        if (existingDoc){
            existingDoc.vaccines.push(newVaccine);
            
            await existingDoc.save();

        }else{
            const data = {
                documentID,
                email,
                telephone,
                vacunatoryCenter,
                date : dateToSave,
                direction,
                vaccines: [newVaccine],
                state
            }
            const vaccineShedule = new VaccineShedule(data)
            await vaccineShedule.save()
        }

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
            to: email,
            subject: 'Notificacion de vacunacion programada',
            text: `Usted ha reservado una cita para vacunacion el dia ${date} en la direccion ${direction}.`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo de verificación:', error);
            } else {
                console.log('Correo de creacion de cita enviado:', info.response);
            }
        });

        res.status(200).json({ message: "Usuario agendado con exito" })
    }
    catch (error) {
        res.status(500).json({ message: "Error al agendar vacuna", error: error })
    }
}
module.exports = registerVaccineShedule;