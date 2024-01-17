const Vaccine = require('../models/vaccineHistoryTable.model.js')
const Certificate = require('../../regulatory_Unit/models/certificate.model.js')
const secretKey = require('../../config.js')
const jwt = require('jsonwebtoken')
const User = require('../../authentication_System/modules/user.model.js')
const { v4: uuidv4 } = require('uuid');

const vaccineAdministration = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const {nameCode, documentID} = req.body;
    const existingVaccineHistory = await Vaccine.findOne({
        where: {
            documentID: documentID,
            nameVaccine: nameCode,
            state: 'Pendiente'
        },
    })

    if (!existingVaccineHistory /*|| existingVaccineHistory.date >= today*/) {
        return res.status(400).json({ error: 'No existe un usuario para administrar vacuna con ese documento, ya ha sido administrada o no corresponde la fecha' });
    }
    try{
        var token = req.headers.authorization;
        token = token ? token.replace("Bearer ", "") : null;
        const tokenDecoded = jwt.verify(token, secretKey);
        const user = await User.findOne({ documentID: tokenDecoded.document });
        const userDocument = user.documentID;

        if(userDocument == documentID){
            return res.status(400).json({ error: 'No se puede administrar la vacuna usted mismo' });
        }

        const vaccineHistory = await Vaccine.update({
            state: 'Administrada',
            dateAdministered: new Date(),
            doctor: userDocument
        },{
            where: {
                documentID: documentID,
                nameVaccine: nameCode,
                state: 'Pendiente'

            },
        });
        const uniqueId = uuidv4();
        const certificate = await Certificate.create({
            uniqueCode: uniqueId,
            documentID: documentID,
            nameVaccine: nameCode
        });
        res.status(201).json({message:"La vacuna ha sido administrada con exito, ya quedo disponible su certificado"});

    }catch(error){
        console.error('Error al administrar vacuna:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
module.exports = vaccineAdministration;
