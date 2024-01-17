const VaccineHistory = require('../../regulatory_Unit/models/vaccineHistoryTable.model.js')
const certificationModel = require('../../regulatory_Unit/models/certificate.model.js');
const axios = require('axios');

const vaccineCertification = async (req, res) => {
    try{
    const { nameVaccine } = req.query;
    const { documentID } = req.body;

    const vaccineCertification = await certificationModel.findOne({
        where: {
            documentID: documentID,
            nameVaccine: nameVaccine
        },
    });
    
    var vaccineCerifi = vaccineCertification.uniqueCode;
    if (!vaccineCertification) {
        return res.status(400).json({ error: 'No existe un usuario con ese documento' });
    }
    const response = await axios.get(`http://localhost:3003/api/certificate?uniqueCode=${vaccineCerifi}`)
    .then((response) => {
        res.status(200).json(response.data);
    })
    .catch((error) => {
        console.error('Error en la solicitud a la URL de certificado:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
module.exports = vaccineCertification;